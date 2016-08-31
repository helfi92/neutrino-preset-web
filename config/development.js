'use strict';

const preset = require('./base');
const path = require('path');
const webpack = require('webpack');

preset.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new webpack.HotModuleReplacementPlugin()
].concat(preset.plugins);
preset.devServer = {
  port: process.env.PORT || 5000,
  host: 'localhost',
  contentBase: path.join(process.cwd(), 'src'),
  // Enable history API fallback so HTML5 History API based
  // routing works. This is a good default that will come
  // in handy in more complicated setups.
  historyApiFallback: true,
  hot: true,
  progress: true,
  // Display only errors to reduce the amount of output.
  stats: 'errors-only'
};

preset.entry.unshift(
  `webpack-dev-server/client?http://localhost:${preset.devServer.port}`,
  'webpack/hot/dev-server',
  require.resolve('babel-polyfill')
);

module.exports = preset;
