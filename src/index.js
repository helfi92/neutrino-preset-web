'use strict';

const exists = require('exists-file');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const merge = require('deepmerge');
const preset = require('neutrino-preset-base');
const path = require('path');
const webpackMerge = require('webpack-merge').smart;

const CWD = process.cwd();
const SRC = path.join(CWD, 'src');
const PROJECT_TEMPLATE = path.join(SRC, 'template.ejs');
const PRESET_TEMPLATE = path.join(__dirname, 'template.ejs');
const FILE_LOADER = require.resolve('file-loader');
const CSS_LOADER = require.resolve('css-loader');
const STYLE_LOADER = require.resolve('style-loader');
const URL_LOADER = require.resolve('url-loader');
const MODULES = path.join(__dirname, '../node_modules');

preset.entry.index.unshift(require.resolve('babel-polyfill'));

const config = webpackMerge(preset, {
  target: 'web',
  node: {
    console: false,
    global: true,
    process: true,
    Buffer: true,
    __filename: 'mock',
    __dirname: 'mock',
    setImmediate: true,
    fs: 'empty',
    tls: 'empty'
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlPlugin({
      template: exists(PROJECT_TEMPLATE) ? PROJECT_TEMPLATE : PRESET_TEMPLATE,
      hash: true,
      xhtml: true
    })
  ],
  eslint: {
    configFile: path.join(__dirname, 'eslint.js')
  },
  resolve: {
    fallback: [MODULES]
  },
  resolveLoader: {
    fallback: [MODULES]
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: FILE_LOADER,
        query: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loaders: [STYLE_LOADER, CSS_LOADER]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: URL_LOADER,
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: URL_LOADER,
        query: {
          limit: '10000',
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: FILE_LOADER
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: URL_LOADER,
        query: {
          limit: '10000',
          mimetype: 'application/svg+xml'
        }
      },
      {
        test: /\.(png|jpg)$/,
        loader: URL_LOADER,
        query: {
          limit: 8192
        }
      },
      {
        test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
        loader: URL_LOADER
      }
    ]
  }
});

if (process.env.NODE_ENV !== 'test') {
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'commons.js',
    minChunks: Infinity
  }));
}

if (process.env.NODE_ENV === 'development') {
  const protocol = !!process.env.HTTPS ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 5000;

  config.devServer = {
    host,
    port,
    https: protocol === 'https',
    contentBase: SRC,
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,
    hot: true,
    progress: true,
    stats: {
      colors: true,
      chunks: false,
      version: false,
      assets: false,
      modules: false,
      children: false,
      source: false
    }
  };
  config.entry.index.unshift(`webpack-dev-server/client?${protocol}://${host}:${port}`);
} else if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    minimize: true,
    compress: { warnings: false }
  }));
} else if (process.env.NODE_ENV === 'test') {
  config.karma = {
    plugins: [
      require.resolve('karma-webpack'),
      require.resolve('karma-chrome-launcher'),
      require.resolve('karma-coverage'),
      require.resolve('karma-mocha'),
      require.resolve('karma-mocha-reporter')
    ],
    basePath: process.cwd(),
    browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['mocha'],
    files: ['test/**/*_test.js'],
    preprocessors: {
      'test/**/*_test.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },
    webpackMiddleware: { noInfo: true },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: '.coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    }
  };
}

module.exports = config;
