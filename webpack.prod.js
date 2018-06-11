/* eslint no-undef: 0 */

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerHost: '0.0.0.0',
    }),
  ],
});
