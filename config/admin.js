module.exports = ({ env }) => ({
  auth: {
    secret: env("JWT_SECRET"),
  },
  url: env("PUBLIC_ADMIN_URL", "admin-content"),
});
