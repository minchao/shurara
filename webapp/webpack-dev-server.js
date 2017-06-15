/**
 * Webpack Dev Server
 */
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')

const webpackConfig = require('./webpack.config')

const devServerConfig = {
    hot: true,
    inline: true,
    https: false,
    lazy: false,
    contentBase: path.join(__dirname, './src/'),
    historyApiFallback: true,
    stats: { colors: true }
}

try {
    const server = new WebpackDevServer(webpack(webpackConfig()), devServerConfig)
    server.listen(3000, 'localhost')
} catch (e) {
    console.error(e)
}