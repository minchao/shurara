/**
 * Webpack Dev Server
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const webpackConfig = require('./webpack.config');

const port = process.env.PORT || 3000;

const env = {
  dev: process.env.NODE_ENV === 'development',
  port
};

const devServerConfig = {
  hot: true,
  lazy: false,
  contentBase: path.join(__dirname, './src/'),
  historyApiFallback: true,
  stats: { colors: true }
};

try {
  const server = new WebpackDevServer(webpack(webpackConfig(env)), devServerConfig);
  server.listen(port, 'localhost');
} catch (e) {
  console.error(e);
}
