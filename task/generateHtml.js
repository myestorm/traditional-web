const { series, parallel, src, dest } = require('gulp')
const { Transform, Readable } = require('readable-stream')
const ejs = require('ejs')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const path = require('path')
const moment = require('moment')
const config = require('../config/config.generate')

// const config = {
//   data: 'data',
//   www: 'www'
// }
const componentsData = {
  aside: {
    categories: {
    },
    tags: []
  }
}

const readAllJSON = () => {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      const JSONData = JSON.parse(file.contents.toString())
      Object.keys(JSONData).forEach(key => {
        const item = JSONData[key]
        // 不处理文集目录
        if (!/^collection/.test(key)) {
          const arr = key.split('/')
          if (arr.length === 1) {
            componentsData.aside.categories[arr[0]] = {
              title: item.title,
              keywords: item.keywords,
              desc: item.desc,
              path: item.path,
              count: item.count,
              children: {}
            }
          } else if (arr.length === 2) { // 仅支持2级目录
            componentsData.aside.categories[arr[0]].children[arr[1]] = {
              title: item.title,
              keywords: item.keywords,
              desc: item.desc,
              path: item.path,
              count: item.count
            }
          }
        }
      })
      callback(null, file)
    }
  })
}

const readTagsJSON = () => {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      const JSONData = JSON.parse(file.contents.toString())
      componentsData.aside.tags = JSONData
      callback(null, file)
    }
  })
}

const readEjsTemplate = () => {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      const JSONData = JSON.parse(file.contents.toString())
      const template = JSONData.template || './template/detail.ejs'
      const ejsTemp = ejs.fileLoader(template)
      console.log(333, path.resolve(__dirname, '../template/'))
      const html = ejs.render(ejsTemp.toString(), {
        data: JSONData,
        aside: componentsData.aside,
        path: path.resolve(__dirname, '../template/')
      })
      file.contents = Buffer.from(html)
      callback(null, file)
    }
  })
}

const resolveAllData = () => {
  return src(`./${config.data}/all.json`)
    .pipe(readAllJSON())
}
const resolveTagsData = () => {
  return src(`./${config.data}/tags.json`)
    .pipe(readTagsJSON())
}
// 生成首页
const generateIndex = () => {
  return src(`./${config.data}/index.json`)
    .pipe((() => {
      return new Transform({
        objectMode: true,
        transform: function (file, encoding, callback) {
          const JSONData = JSON.parse(file.contents.toString())
          const template = JSONData.template || './template/index.ejs'
          const ejsTemp = ejs.fileLoader(template)
          const html = ejs.render(ejsTemp.toString(), {
            head: {
              title: config.sitename,
              keywords: [],
              desc: [],
              styles: [`${config.host}${config.assetsPath}styles/vendor-9.ac6d5e8379cab5f01053.css`]
            },
            header: {
              current: 0
            },
            aside: {
              categories: componentsData.aside.categories,
              tags: componentsData.aside.tags
            },
            main: JSONData,
            footer: {
              beian: config.beian
            },
            scripts: [`${config.host}${config.assetsPath}scripts/vendor-ac6d5e8379cab5f01053.js`, `${config.host}${config.assetsPath}scripts/index-ac6d5e8379cab5f01053.js`],
            path: path.resolve(__dirname, '../template/'),
            host: config.host,
            assetsPath: config.assetsPath,
            moment
          })
          file.contents = Buffer.from(html)
          callback(null, file)
        }
      })
    })())
    .pipe(rename({ extname: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(`${config.www}/`))
}
// 生成文章详细页
const detailToHtml = () => {
  return src([`${config.data}/**/*.json`, `!${config.data}/**/index.json`, `!${config.data}/collection/**/*.json`, `!${config.data}/all.json`, `!${config.data}/tags.json`])
    .pipe(readEjsTemplate())
    .pipe(rename({ extname: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(`${config.www}/`))
}
module.exports = series(resolveAllData, resolveTagsData, parallel(
  generateIndex
))
