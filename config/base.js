'use strict';

const exists = require('exists-file');
const DefinePlugin = require('webpack').DefinePlugin;
const HtmlPlugin = require('html-webpack-plugin');
const merge = require('deepmerge');
const preset = require('neutrino-preset-base');
const path = require('path');
const webpackMerge = require('webpack-merge').smart;

const PROJECT_TEMPLATE = path.join(preset.SRC, 'template.ejs');
const PRESET_TEMPLATE = path.join(__dirname, '../src/template.ejs');

module.exports = webpackMerge(preset, {
  output: {
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new HtmlPlugin(merge({
      template: exists(PROJECT_TEMPLATE) ? PROJECT_TEMPLATE : PRESET_TEMPLATE,
      hash: true,
      xhtml: true
    }, preset.PROJECT_PKG.config ? preset.PROJECT_PKG.config.html : {}))
  ],
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file',
        query: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: '10000',
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: '10000',
          mimetype: 'application/svg+xml'
        }
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url',
        query: {
          limit: 8192
        }
      },
      {
        test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url'
      }
    ]
  }
});
