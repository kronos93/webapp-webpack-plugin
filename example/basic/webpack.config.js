const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('../../src/');

const webpack = require('webpack');

module.exports = (env, args) => {
  return {
    context: __dirname,
    entry: './src/app.js',
    output: {
      path: resolve(__dirname, 'public'),
      publicPath: '/',
      filename: 'app.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
      new WebappWebpackPlugin('./src/favicon.png'),
    ],
    stats: "errors-only"
  };
}
