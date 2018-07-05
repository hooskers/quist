/* eslint no-undef: 0 */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/app.jsx',
    firebase: './src/js/firebase.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './src/index.html',
    }),
    new WebpackPwaManifest({
      name: 'Bowerlist',
      short_name: 'Bowerlist',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      gcm_sender_id: '103953800507',
    }),
  ],
  module: {
    rules: [
      {
        test: /firebase-messaging-sw\.js/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)|(firebase-messaging-sw\.js)/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    globalObject: 'this', // Only because of this: https://github.com/webpack/webpack/issues/6642
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
