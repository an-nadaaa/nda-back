const generateStripeProductId = require("../../../../utils/generateStripeProductId");
require("dotenv").config();

const STRIPE_GENERAL_PRODUCT_ID = process.env.STRIPE_GENERAL_PRODUCT_ID;

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // generate a stripe product and replace the default product property with the stripe product id
    event.params.data.product = await generateStripeProductId(data);
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // generate a stripe product and replace the default product property with the stripe product id
    if (data.product === STRIPE_GENERAL_PRODUCT_ID) {
      const id = await generateStripeProductId(data);
      event.params.data.product = id;
    }
  },

  afterDelete(event) {
    // delete the stripe product
    if (
      event.result.product !== STRIPE_GENERAL_PRODUCT_ID &&
      event.result.environment === "development"
    ) {
      axios({
        url: `${process.env.FUNCTIONS_BASE_URL}/products-handler`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(event.result),
      });
    }
  },
};
