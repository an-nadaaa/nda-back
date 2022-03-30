module.exports = ({ env }) => [
  "strapi::errors",
  "strapi::logger",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      includeUnparsed: true,
    },
  },
  "global::prometheus-api-metrics",
  "global::stripe",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    name: "strapi::cors",
    config: {
      origin: (ctx) => {
        const origin = ctx.request.header.origin;
        // const allowedOrigins = env("CORS_ORIGINS").split(",");
        // if (allowedOrigins.includes(origin)) {
        //   return origin;
        // }

        // return allowedOrigins[0];
        return origin;
      },
    },
  },
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", `${env("CDN_BASE_URL")}`],
          "media-src": ["'self'", "data:", "blob:", `${env("CDN_BASE_URL")}`],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
