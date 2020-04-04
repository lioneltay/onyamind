const path = require("path")

const fromRoot = (str) => path.join(__dirname, str)

module.exports = {
  roots: ["./src"],
  moduleDirectories: ["node_modules", "src", "test"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  setupFiles: [fromRoot("src/testing/setup/babel.ts")],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
