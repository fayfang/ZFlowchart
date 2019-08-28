const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let compiler = webpack({
  mode: 'development',
  entry: path.join(__dirname, '../demo/index.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'demo.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../index.html')
    })
  ],
  performance: {
    hints: false,
  },
})

let dev = new webpackDevServer(compiler);
dev.listen(8888, '0.0.0.0', () => {
})