const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const relativeToRoot = (relativePath) =>
  path.resolve(__dirname, "../", relativePath)

const babel_loader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
  },
}

module.exports = {
  entry: {
    main: [
      relativeToRoot("./src/index.tsx"),
      relativeToRoot("./src/service-worker/service.worker.ts"),
    ],
  },

  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    modules: [path.resolve(__dirname, relativeToRoot("./src")), "node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [babel_loader],
      },
      {
        test: /.worker.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "worker-loader",
            options: {
              name: "[name].js",
            },
          },
          babel_loader,
        ],
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
