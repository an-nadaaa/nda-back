"use strict";
const { ESBuildMinifyPlugin } = require("esbuild-loader");

// Trying to switch to esbuild for faster builds
/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config

  // TODO: need to add an esbuild plugin to resolve the ee-else-ce (Enterprise else Community Edition)
  const old = config.module.rules[0];
  config.module.rules[0] = {
    test: /\.m?js$/,
    include: old.include,
    loader: "esbuild-loader",
    options: {
      loader: "jsx", // Remove this if you're not using JSX
      target: "es2015", // Syntax to compile to (see options below for possible values)
    },
  };
  // console.log("New Rules", config.module.rules);
  config.optimization.minimizer = [
    new ESBuildMinifyPlugin({
      target: "es2015", // Syntax to compile to (see options below for possible values)
    }),
  ];
  // console.log(config.optimization);
  return config;
};
