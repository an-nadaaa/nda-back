require("dotenv").config();
const { default: axios } = require("axios");
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
      let event, session, product, charge, payment;
      try {
        event = stripe.webhooks.constructEvent(
          ctx.request.body[unparsed],
          sig,
          endpointSecret
        );
      } catch (err) {
        // console.log("Error:", err);
        ctx.response.status = 400;
        ctx.body = JSON.stringify({
          status: 400,
          message: `Stripe webhook Error: ${err.message}`,
        });
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          payment = event.data.object;
          message = `
          ✅ Payment Succeeded!
💳 Payment ID: ${payment.id}
💰 Amount: ${payment.currency.toUpperCase()} ${payment.amount / 100}
🧾 Receipt URL: ${payment.charges.data[0].receipt_url}
                    `;
          await axios({
            url: process.env.TELEGRAM_PUSH,
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            data: message,
          });
          break;
        case "payment_intent.payment_failed":
          payment = event.data.object;
          break;
        case "payment_intent.canceled":
          payment = event.data.object;
          break;
        case "payment_method.created":
          payment = event.data.object;
          break;
        case "charge.refunded":
          charge = event.data.object;
          break;
        case "checkout.session.expired":
          session = event.data.object;
          // Then define and call a function to handle the event checkout.session.expired
          break;
        case "checkout.session.completed":
          session = event.data.object;
          // retrieve the product id from the session
          const { lineItems } = await stripe.checkout.sessions.retrieve(
            session.id,
            {
              expand: ["line_items"],
            }
          );
          //   console.log(session);
          //   console.log("Items", lineItems);
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
                `;
          // Then define and call a function to handle the event checkout.session.completed
          await axios({
            url: process.env.TELEGRAM_PUSH,
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            data: message,
          });
          break;
        case "product.created":
          product = event.data.object;
          // Then define and call a function to handle the event product.created
          break;
        case "product.deleted":
          product = event.data.object;
          // Then define and call a function to handle the event product.deleted
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      //   console.log(`Webhook received: ${event.type}`);
      //   console.log(`Webhook content:`, event.data.object);

      let data = await strapi.db.query("api::cause.cause").findOne({
        id: 1,
        populate: {
          dynamicZone: true,
        },
      });
      //   console.log(data);
      // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine/single-operations.html#update
      data = await strapi.db
        .query(data.dynamicZone[0].__component)
        .findOne({ id: data.dynamicZone[0].id });
      //   console.log(data);

      ctx.response.send({
        status: 200,
        message: "ok",
      });
    } else {
      await next();
    }
  };
};
