const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const babel_loader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
  },
}

module.exports = {
  entry: {
    main: [relativeToRoot("./src/index.tsx")],
  },

  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    modules: [path.resolve(__dirname, relativeToRoot("./src")), "node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: "raw-loader",
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [babel_loader],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
}
