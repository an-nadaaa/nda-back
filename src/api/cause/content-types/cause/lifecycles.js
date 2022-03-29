const generateStripeProductId = require("../../../../utils/generateStripeProductId");
const notifyEditorialChannel = require("../../../../utils/notifyContentChannel");
require("dotenv").config();
const { default: axios } = require("axios");

const STRIPE_GENERAL_PRODUCT_ID_DEV = process.env.STRIPE_GENERAL_PRODUCT_ID_DEV;
const STRIPE_GENERAL_PRODUCT_ID_PROD =
  process.env.STRIPE_GENERAL_PRODUCT_ID_PROD;
const FUNCTION_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FUNCTIONS_BASE_URL
    : "http://localhost:8888/.netlify/functions";

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const { title, description } = await strapi.db
      .query("causes.base-model")
      .findOne({ id: data.base.id });
    if (data.cover) {
      const { url } = await strapi.plugins.upload.services.upload.findOne(
        data.cover
      );
      event.params.data.product = await generateStripeProductId(
        title,
        description,
        url,
        data.product,
        data.environment
      );
    } else {
      // generate a stripe product and replace the default product property with the stripe product id
      event.params.data.product = await generateStripeProductId(
        title,
        description,
        undefined,
        data.product,
        data.environment
      );
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    // generate a stripe product and replace the default product property with the stripe product id
    if (
      data.product === STRIPE_GENERAL_PRODUCT_ID_DEV ||
      data.product === STRIPE_GENERAL_PRODUCT_ID_PROD ||
      data.product === "PRODUCT_WILL_BE_CREATED"
    ) {
      let id;
      const { title, description } = await strapi.db
        .query("causes.base-model")
        .findOne({ id: data.base.id });
      if (data.cover) {
        const { url } = await strapi.plugins.upload.services.upload.findOne(
          data.cover
        );
        id = await generateStripeProductId(
          title,
          description,
          url,
          data.product,
          data.environment
        );
      } else {
        id = await generateStripeProductId(
          title,
          description,
          undefined,
          data.product,
          data.environment
        );
      }
      event.params.data.product = id;
    }
  },

  async afterDelete(event) {
    // delete the stripe product for development environment
    if (event.params.data) {
      if (event.params.data.product !== STRIPE_GENERAL_PRODUCT_ID_DEV) {
        await axios({
          url: `${FUNCTION_BASE_URL}/products-handler`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(event.params.data),
        });
      }
    } else if (event.params.where.$and) {
      for (
        let i = 0;
        i < event.params.where.$and[1].$and[0].id.$in.length;
        i++
      ) {
        const id = event.params.where.$and[1].$and[0].id.$in[i];
        const entity = await strapi.db
          .query(`${event.model.uid}`)
          .findOne({ id });
        if (entity.product !== STRIPE_GENERAL_PRODUCT_ID_DEV) {
          await axios({
            url: `${FUNCTION_BASE_URL}/products-handler`,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(entity),
          });
        }
      }
    }
    try {
      await notifyEditorialChannel(event);
    } catch (error) {
      strapi.log.error(error);
    }
  },

  async afterCreate(event) {
    try {
      await notifyEditorialChannel(event);
    } catch (error) {
      strapi.log.error(error);
    }
  },

  async afterUpdate(event) {
    try {
      await notifyEditorialChannel(event);
    } catch (error) {
      strapi.log.error(error);
    }
  },
};
