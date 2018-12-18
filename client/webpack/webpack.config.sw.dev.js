const path = require("path")
const webpack = require("webpack")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const common_config = require("./webpack.config.common")

module.exports = {
  ...common_config,
  mode: "development",
  target: "webworker",

  entry: {
    sw: relativeToRoot("./src/service-worker/index.ts"),
  },

  output: {
    filename: "service-worker.js",
    path: relativeToRoot("./dist"),
    publicPath: "/",
  },

  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
}
