const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

const relativeToRoot = (relativePath) =>
  path.resolve(__dirname, "../", relativePath)

const common_config = require("./webpack.config.common")

module.exports = {
  ...common_config,
  mode: "production",

  output: {
    filename: "[name].[hash].js",
    path: relativeToRoot("./dist"),
    publicPath: "/",
  },

  optimization: {
    usedExports: true,
  },

  devtool: "source-map",

  plugins: [
    ...common_config.plugins,
    new webpack.EnvironmentPlugin({
      // From TravisCI
      APP_MODE: process.env.APP_MODE || "staging",
      NODE_ENV: "production",
    }),
    new CopyWebpackPlugin([
      {
        from: relativeToRoot("./static"),
        to: relativeToRoot("./dist"),
      },
    ]),
    ...(process.env.ANALYZE
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
          }),
        ]
      : []),
  ],
}
