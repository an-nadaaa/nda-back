const { koaMiddleware } = require("prometheus-api-metrics");

// default config
const metricsConf = {
  metricsPath: "/metrics",
  defaultMetricsInterval: 5000,
  durationBuckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5],
  requestSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  responseSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  useUniqueHistogramNames: false,
  // excludeRoutes: ['/metrics'],
  includeQueryParams: true,
  // additionalLabels: ["env"],
  // extractAdditionalLabelValuesFn: (ctx) => {
  //   return {
  //     env: process.env.NODE_ENV,
  //     // 'version': '1.0.0',
  //   };
  // },
};
const wrapper = koaMiddleware(metricsConf);

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.req.url === metricsConf.metricsPath) {
      return wrapper(ctx, next);
    } else if (ctx.req.url === `${metricsConf.metricsPath}.json`) {
      return wrapper(ctx, next);
    } else if (ctx.response.status != 404) {
      return wrapper(ctx, next);
    } else {
      return await next();
    }
  };
};
