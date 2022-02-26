module.exports = ({ env }) => [
  "strapi::errors",
  "strapi::cors",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
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
