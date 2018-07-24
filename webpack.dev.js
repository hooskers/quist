const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

/* eslint no-undef: 0 */

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8080,
    host: 'localhost',
    historyApiFallback: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
