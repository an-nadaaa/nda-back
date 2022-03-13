const { default: axios } = require("axios");
require("dotenv").config();

const FUNCTIONS_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FUNCTIONS_BASE_URL
    : "http://localhost:8888/.netlify/functions";
// this function is used to generate a stripe product and return it's id
module.exports = async (eventData, url) => {
  // we use object assign to not mutate the eventData to avoid side effects see more: https://trimagency.com/blogs/immutable-objects-using-object-assign/#:~:text=Now%20that's%20immutable!,our%20'source'%20objects%20intact.
  const entity = Object.assign({}, eventData, { cover: url });
  const { data } = await axios({
    url: `${FUNCTIONS_BASE_URL}/products-handler`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(entity),
  }).catch((e) => {
    throw new Error(e);
  });
  return data.id;
};
