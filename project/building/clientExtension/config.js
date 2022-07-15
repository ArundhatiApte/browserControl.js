"use strict";

const willMinify = process.env.willMinify === "1";

module.exports = {
  optimization: willMinify ? {
    minimize: true,
    minimizer: [new (require("terser-webpack-plugin"))({
      include: /\.js$/
    })]
  } : {
    minimize: false,
    moduleIds: "named"
  },
  stats: "errors-only"
};
