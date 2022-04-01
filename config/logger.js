"use strict";

const {
  winston,
  formats: { prettyPrint, levelFilter },
} = require("@strapi/logger");
const LokiTransport = require("winston-loki");

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
        ]
      : [
          new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
              levelFilter("http"),
              prettyPrint({ timestamps: "YYYY-MM-DD hh:mm:ss.SSS" })
            ),
          }),
          new LokiTransport({
            host: process.env.LOGGER_HOST,
            json: true,
          }),
        ],
};
