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
});
