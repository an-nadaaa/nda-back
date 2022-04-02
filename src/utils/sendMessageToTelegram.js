require("dotenv").config();
const { default: axios } = require("axios");

module.exports = async (message, channel) => {
  switch (channel) {
    case "donations":
      // send message to telegram donations channel
      break;
    case "editorial":
      // send message to telegram editorial channel
      await axios({
        url: `${process.env.TELEGRAM_PUSH}?parse_mode=markdown`,
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
