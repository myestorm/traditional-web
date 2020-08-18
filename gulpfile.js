const { series, src, dest, watch } = require('gulp')

// gulp plugins
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
const del = require('del')
const webpack = require('webpack-stream')

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')

// other package
const path = require('path')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const { createProxyMiddleware } = require('http-proxy-middleware')
const { dist, tmpDir, proxys, port } = require('./config/config.default')

// 环境变量
const ENV = process.env ? ((process.env.NODE_ENV ? process.env.NODE_ENV.trim() : '') || 'production') : 'production'

/**
 * 删除目录
 * @param {Function} cb 
 */
const delTemp = (cb) => {
  return del([
    `./${tmpDir}/**/*`,
    `./${dist}/**/*`
  ], {
    force: true
  }, cb)
}

/**
 * ejs转换成webpack能识别的模板文件
 */
const ejsToHtml = () => {
  return src('./src/pages/**/*.ejs')
  .pipe(ejs({
    current: '1'
  }))
  .pipe(rename({ extname: '.html' }))
  .pipe(dest(`${tmpDir}/`))
}

/**
 * webpack 构建文件
 */
const build = () => {
  return src('./src/pages/index/index.js')
    .pipe(webpack({
      mode: ENV, // development production none
      stats: 'errors-only',
      plugins: [new HtmlWebpackPlugin({
        title: 'My App',
        filename: 'index.html',
        template: path.join(`./${tmpDir}`, 'index/index.html')
      })]
    }))
    .pipe(dest(`${dist}/`))
    .pipe(reload({ stream: true })) // 刷新浏览器
}

/**
 * browser-sync 启用http服务
 */
const serve = () => {
  /**
   * 配置接口代理
   */
  const middleware = []
  Object.keys(proxys).forEach(key => {
    middleware.push(createProxyMiddleware(key, proxys[key]))
  })
  browserSync.init({
    ui: false,
    server: {
      baseDir: path.resolve(__dirname, `${dist}/`),
      index: 'index.html',
      middleware: middleware
    },
    port: port,
    open: false,
    notify: false
  })
  // 监听ejs文件的修改
  watch(['./src/pages/**/*.ejs', './src/components/**/*.ejs'], series(ejsToHtml, build))
}

exports.serve = series(delTemp, ejsToHtml, build, serve)
exports.default = series(delTemp, ejsToHtml, build)
