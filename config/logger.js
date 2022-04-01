"use strict";

const {
  winston,
  formats: { prettyPrint, levelFilter },
} = require("@strapi/logger");
const LogzioWinstonTransport = require("winston-logzio");

module.exports = {
  transports:
    process.env.NODE_ENV === "production"
      ? [
          new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
              levelFilter("http"),
              prettyPrint({ timestamps: "YYYY-MM-DD hh:mm:ss.SSS" })
            ),
          }),
          new LogzioWinstonTransport({
            level: "info",
            name: "api_logzio",
            token: process.env.LOGZIO_TOKEN,
            host: "listener-eu.logz.io",
          }),
        ]
      : [
          new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
              levelFilter("http"),
              prettyPrint({ timestamps: "YYYY-MM-DD hh:mm:ss.SSS" })
            ),
          }),
        ],
};
