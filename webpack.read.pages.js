const glob = require('glob');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsList = require('./webpack.assets.list');
const webpackAssetsList = new WebpackAssetsList();

class WebpackReadPages {
  config = './src/pages/**/config.json';
  entrys = {};
  htmlWebpackPlugins = [];

  constructor (config) {
    if (config) {
      this.config = config;
    }
    this.readConfig();
  }

  readConfig () {
    const files = glob.sync(this.config);
    const entrys = {};
    const htmls = [webpackAssetsList];
    files.forEach(file => {
      const fileData = path.parse(file);
      const filePath = path.resolve(__dirname, file);
      const fileContent = require(filePath);
      entrys[fileContent.filename] = `${fileData.dir}/${fileContent.entry}`;
      htmls.push(new HtmlWebpackPlugin({
        title: fileContent.title,
        filename: `${fileContent.filename}.html`,
        template: `${fileData.dir}/${fileContent.template}`,
        chunks: [fileContent.filename],
        minify: false
      }));
    });
    this.entrys = entrys;
    this.htmlWebpackPlugins = htmls;
  }
}

module.exports = WebpackReadPages;
