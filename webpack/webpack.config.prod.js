const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

const relativeToRoot = relativePath =>
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

  plugins: [
    ...common_config.plugins,
    new webpack.EnvironmentPlugin({
      APP_MODE: "production",
    }),
    new CopyWebpackPlugin([
      {
        from: relativeToRoot("./public"),
        to: relativeToRoot("./dist/public"),
      },
      {
        from: relativeToRoot("./server.js"),
        to: relativeToRoot("./dist/server.js"),
      },
    ]),
  ],
}
