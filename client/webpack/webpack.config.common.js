const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

module.exports = {
  entry: {
    main: relativeToRoot("./src/index.tsx"),
  },

  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    modules: [path.resolve(__dirname, relativeToRoot("./src")), "node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: "ts-loader",
            options: { transpileOnly: true },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    // new WorkboxPlugin.InjectManifest({
    //   swSrc: relativeToRoot("./src/service-worker/index.js"),
    //   swDest: relativeToRoot("./dist/service-worker.js"),
    // }),
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
  ],
}
