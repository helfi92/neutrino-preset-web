'use strict';

const preset = require('./base');
const webpack = require('webpack');

preset.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false },
  output: { comments: false },
  sourceMap: false
}));

preset.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  })
]
.concat(preset.plugins);

module.exports = preset;
