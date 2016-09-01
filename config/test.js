'use strict';

const preset = require('./base');

preset.karma = {
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

module.exports = preset;
