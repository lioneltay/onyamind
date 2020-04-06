const path = require("path")

const fromRoot = (str) => path.join(__dirname, str)

module.exports = {
  roots: ["./src"],
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src", "test"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  setupFiles: [fromRoot("src/testing/setup/babel.ts"), "fake-indexeddb/auto"],
  // setupFilesAfterEnv: [fromRoot("src/testing/setup/mocks.ts")],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
