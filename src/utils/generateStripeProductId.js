const { default: axios } = require("axios");
require("dotenv").config();

const FUNCTIONS_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FUNCTIONS_BASE_URL
    : "http://localhost:8888/.netlify/functions";
// this function is used to generate a stripe product and return it's id
module.exports = async (title, description, url, product, environment) => {
  const { data } = await axios({
    url: `${FUNCTIONS_BASE_URL}/products-handler`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      title,
      description,
      cover: url,
      product,
      environment,
    }),
  }).catch((e) => {
    throw new Error(e);
  });
  return data.id;
};
