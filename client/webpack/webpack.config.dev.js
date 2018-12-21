const path = require("path")
const webpack = require("webpack")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const common_config = require("./webpack.config.common")

module.exports = {
  ...common_config,
  mode: "development",

  output: {
    filename: "[name].js",
    path: relativeToRoot("./dist"),
    publicPath: "/",
  },

  devServer: {
    hot: false,
    port: 3000,
    historyApiFallback: true,
  },

  plugins: [
    ...common_config.plugins,
    // new webpack.HotModuleReplacementPlugin()
  ],
}
