require("dotenv").config();
const { default: axios } = require("axios");

module.exports = async (message, channel) => {
  switch (channel) {
    case "donations":
      // send message to telegram donations channel
      await axios({
        url: `${process.env.TELEGRAM_DONATION_PUSH}`,
        method: "POST",
        headers: {
          "Content-Type": "text/text",
        },
        data: message,
      });
      break;
    case "editorial":
      // send message to telegram editorial channel
      await axios({
        url: `${process.env.TELEGRAM_EDITORIAL_PUSH}?parse_mode=markdownv2`,
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        data: message,
      });
      break;
    default:
      break;
  }
};
