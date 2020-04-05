const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

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

  devtool: "source-map",

  plugins: [
    ...common_config.plugins,
    new webpack.EnvironmentPlugin({
      // From TravisCI
      APP_MODE: process.env.APP_MODE || "staging",
    }),
    new CopyWebpackPlugin([
      {
        from: relativeToRoot("./public"),
        to: relativeToRoot("./dist/public"),
      },
    ]),
  ],
}
