module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "aaa6687f774e33718906682dc39996ee"),
  },
  url: env("PUBLIC_ADMIN_URL", "/admin-content"),
});
