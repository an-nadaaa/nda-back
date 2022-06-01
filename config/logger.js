"use strict";

const {
  winston,
  formats: { prettyPrint, levelFilter },
} = require("@strapi/logger");
const ecsFormat = require("@elastic/ecs-winston-format");
// import stripAnsi from "strip-ansi";

const removeAnsi = (module.exports =
  process.env.NODE_ENV === "production"
    ? {
        transports: [
          new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
              levelFilter("http"),
              winston.format.uncolorize(),
              ecsFormat()
            ),
          }),
        ],
      }
    : {
        transports: [
          new winston.transports.Console({
            level: "silly",
            format: winston.format.combine(
              levelFilter("silly"),
              prettyPrint({ timestamps: "YYYY-MM-DD hh:mm:ss.SSS" })
            ),
          }),
        ],
      });
