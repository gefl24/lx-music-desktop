const path = require('path')

module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@root': path.resolve(__dirname, '../'),
      '@common': path.resolve(__dirname, '../src/common'),
      '@main': path.resolve(__dirname, '../src/main'),
      '@renderer': path.resolve(__dirname, '../src/renderer'),
      '@server': path.resolve(__dirname, '../src/server'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
}
