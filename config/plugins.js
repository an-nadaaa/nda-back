module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-aws-s3-advanced",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID", "0045c4e97093f260000000004"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION", "us-west-004"),
        endpoint: env("AWS_ENDPOINT"),
        params: {
          bucket: env("AWS_BUCKET"),
        },
        // baseUrl: env("CDN_BASE_URL"), // e.g. https://cdn.example.com, this is stored in strapi's database to point to the file
      },
    },
  },
  "rest-cache": {
    config: {
      provider: {
        name: "memory",
        // https://github.com/isaacs/node-lru-cache/tree/v6.0.0#options
        options: {
          // The maximum size of the cache
          max: 32767,
          // Maximum age in ms.
          maxAge: 3600,
        },
      },
      strategy: {
        contentTypes: [
          // list of Content-Types UID to cache
          "api::cause.cause",
          "api::nature.nature",
          "api::tag.tag",
        ],
      },
    },
  },
});
