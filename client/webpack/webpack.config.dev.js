const source_config = require('./webpack.config.source.dev')
const sw_config = require('./webpack.config.sw.dev')

module.exports = [sw_config, source_config]