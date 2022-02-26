module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DB_HOST", "db.wxdjvetpajrkagcyyahc.supabase.co"),
      port: env.int("DB_PORT", 5432),
      DB: env("DB_NAME", "postgres"),
      user: env("DB_USERNAME", "postgres"),
      password: env("DB_PASSWORD"),
      // ssl: env.bool("DB_SSL", true),
    },
  },
});
