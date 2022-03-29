// https://stripe.com/docs/webhooks/best-practices
require("dotenv").config();
const { default: axios } = require("axios");
const sendToTelegram = require("../utils/sendMessageToTelegram");
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET_PROD
    : process.env.STRIPE_WEBHOOK_SECRET_DEV;

const STRIPE_SK =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SK_PROD
    : process.env.STRIPE_SK_DEV;

const stripe = require("stripe")(STRIPE_SK);
const unparsed = Symbol.for("unparsedBody");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url === "/stripe/webhook") {
      const sig = ctx.request.header["stripe-signature"];
      let message, event, session, product, charge, payment;
      try {
        event = stripe.webhooks.constructEvent(
          ctx.request.body[unparsed],
          sig,
          endpointSecret
        );
      } catch (err) {
        ctx.response.status = 400;
        ctx.body = JSON.stringify({
          status: 400,
          message: `Stripe webhook Error: ${err.message}`,
        });
        return;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          session = event.data.object;
          // retrieve the product id from the session
          const { line_items } = await stripe.checkout.sessions.retrieve(
            session.id,
            {
              expand: ["line_items.data.price.product"],
            }
          );
          for (let i = 0; i < line_items.data.length; i++) {
            const item = line_items.data[i];
            const amount = item.price.unit_amount / 100;
            const productId = item.price.product.id;
            // query the cause where the product id matches the product id
            let cause = await strapi.db.query("api::cause.cause").findOne({
              where: { product: productId },
              populate: {
                dynamicZone: true,
              },
            });
            // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine/single-operations.html#update
            if (cause) {
              await strapi.db.query(cause.dynamicZone[0].__component).update({
                where: {
                  id: cause.dynamicZone[0].id,
                },
                data: {
                  raised: cause.dynamicZone[0].raised + amount,
                },
              });
            }
          }

          message = `
                  ✅ Session completed!
      
📧 Customer Email: ${session.customer_email}
Customer Details:
    📧 Email: ${session.customer_details.email}
    ☎️ Phone: ${session.customer_details.phone}
💰 Amount Donated: ${
            session.amount_total / 100
          } ${session.currency.toUpperCase()}
Payment Intent ID: ${session.payment_intent}

Donated to:
${line_items.data.map((item) => {
  return `
${item.price.product.name}
${item.price.product.images[0]}
  `;
}).join(`
`)}
                `;
          // Then define and call a function to handle the event checkout.session.completed
          await sendToTelegram(message, "donations");
          break;
        default:
          strapi.log.info(`Unhandled event type ${event.type}`);
      }

      strapi.log.info(`Webhook received: ${event.type}`);
      strapi.log.info(`Webhook event ID: ${event.id}`);

      ctx.response.send({
        status: 200,
        message: "ok",
      });
    } else {
      await next();
    }
  };
};
