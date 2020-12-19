const HtmlWebpackPlugin = require('html-webpack-plugin');
const beautifyHtml = require('js-beautify').html;

const env = process.env.NODE_ENV;

class WebpackAssetsList {
  assets = {};
  filename = 'config.json';

  constructor (filename) {
    if (filename) {
      this.filename = filename;
    }
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('WebpackAssetsList', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        'WebpackAssetsList',
        (data, cb) => {
          if (env === 'production') {
            const outputName = data.outputName;
            const assetTags = data.assetTags;
            const item = {
              scripts: [],
              styles: []
            }
            assetTags.scripts.forEach(sub => {
              item.scripts.push(sub.attributes.src);
            })
            assetTags.styles.forEach(sub => {
              item.styles.push(sub.attributes.href);
            })
            this.assets[outputName] = item;
            const content = JSON.stringify(this.assets, null, 4);
            compilation.assets[this.filename] = {
              source: function () {
                  return content;
              },
              size: function() {
                  return content.length;
              }
            }
          }
          cb(null, data);
        }
      )

      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'WebpackAssetsList',
        (data, cb) => {
          data.html = beautifyHtml(data.html, {
            indent_size: 2,
            end_with_newline: true,
            max_preserve_newlines: 0
          });
          cb(null, data);
        }
      )
    })
  }
}

module.exports = WebpackAssetsList;
