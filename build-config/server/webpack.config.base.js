const path = require('path')
const { merge } = require('webpack-merge')
const webpackConfigBase = require('../webpack-build-config')

const webpackConfigServer = {
  target: 'node',
  entry: {
    server: path.resolve(__dirname, '../../src/server/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
  },
}

module.exports = merge(webpackConfigBase, webpackConfigServer)
