const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackReadPages = require('./webpack.read.pages');

const webpackReadPages = new WebpackReadPages();

let webpackPlugins = webpackReadPages.htmlWebpackPlugins;
webpackPlugins = webpackPlugins.concat([
  new MiniCssExtractPlugin({
    filename: 'styles/[name].[fullhash:6].css'
  }),
  new FriendlyErrorsWebpackPlugin(),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [{
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist')
    }]
  })
])

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  stats: 'normal',
  entry: webpackReadPages.entrys,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name]-[fullhash:6].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.join(__dirname, 'src', 'assets')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
      minSize: 30000
    }
  },
  devServer: {
    // host: '0.0.0.0',
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9000,
    inline: true,
    quiet: true,
    historyApiFallback: true
  },
  plugins: webpackPlugins,
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../images/',
              outputPath: 'images',
              name: '[name].[hash:6].[ext]',
              esModule: true
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../images/',
              outputPath: 'font',
              name: '[name].[hash:6].[ext]',
              esModule: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { 
        test: /\.(ejs|html)$/i, 
          use: [
            { 
              loader: path.resolve(__dirname, 'webpack.ejs.loader.js'),
              options: {
                a: '111'
              }
            } 
          ] 
      }
    ]
  }
};
