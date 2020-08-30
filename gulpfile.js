const { series, parallel, src, dest, watch } = require('gulp')
const generateData = require('./task/generateData')
const generateHtml = require('./task/generateHtml')

// gulp plugins
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
const del = require('del')
const webpack = require('webpack-stream')

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// other package
const path = require('path')
const glob = require('glob')
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

const getConfigFiles = () => {
  const folder = './src/pages/**/*.json'
  const files = glob.sync(folder)
  const entries = {} // webpack 入口文件
  const htmlTemplate = [] // webpack HtmlWebpackPlugin
  files.forEach(filePath => {
    const params = path.parse(filePath)
    let file = {}
    try {
      file = require(path.resolve(__dirname, filePath))
    } catch (err) {
      throw new Error(`${filePath} must be JSON data`)
    }
    entries[file.filename] = path.resolve(__dirname, `${params.dir}/index.js`)

    const template = params.dir.replace('src/pages', tmpDir)
    htmlTemplate.push(new HtmlWebpackPlugin({
      title: file.title,
      filename: `${file.filename}.html`,
      template: path.resolve(__dirname, `${template}/index.html`),
      inject: true,
      chunks: [file.filename],
      minify: false,
      favicon: path.resolve(__dirname, 'src/favicon.ico')
    }))
  })
  return {
    entries,
    htmlTemplate
  }
}

/**
 * webpack 构建文件
 */
const { entries, htmlTemplate } = getConfigFiles()
const build = () => {
  return src('./src/pages/index/index.js')
    .pipe(webpack({
      entry: entries,
      output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'scripts/[name]-[hash].js'
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              name: 'vendor',
              chunks: 'initial',
              minChunks: 1,
              minSize: 0
            }
          }
        },
        chunkIds: 'natural'
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ejs', '.json', '.css', '.scss', '.vue'],
        modules: [
          path.resolve('./'),
          path.resolve('./node_modules')
        ],
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@assets': path.join(__dirname, 'src', 'assets')
        }
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.scss$/,
            use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: true,
                publicPath: '../'
              }
            }, 'css-loader', 'sass-loader', {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.resolve(__dirname, './src/assets/scss/variables.scss'),
                  path.resolve(__dirname, './src/assets/scss/mixins.scss')
                ]
              }
            }]
          },
          {
            test: /\.js$/,
            exclude: /(node_modules|dist|.tmp)/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }, {
              loader: 'eslint-loader',
              options: {
                emitError: true
              }
            }]
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  outputPath: 'images',
                  name: '[name].[hash].[ext]',
                  esModule: false
                }
              }
            ]
          },
          {
            test: /\.(woff|svg|eot|ttf)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  outputPath: 'font',
                  name: '[name].[hash].[ext]',
                  esModule: false
                }
              }
            ]
          }
        ]
      },
      mode: ENV, // development production none
      stats: 'errors-only',
      plugins: htmlTemplate.concat([
        new MiniCssExtractPlugin({
          filename: 'styles/[name].[hash].css',
          chunkFilename: 'styles/[name]-[id].[hash].css'
        })
      ])
    }))
    .pipe(dest(`${dist}/`))
    .pipe(reload({ stream: true })) // 刷新浏览器
}

const copyAssets = () => {
  return src('./src/assets/images/covers/**/*.*')
    .pipe(dest(`${dist}/images/covers/`))
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
  // 监听文件资源的修改
  watch(['./src/**/*.*', '!./src/pages/**/*.ejs', '!./src/components/**/*.ejs'], parallel(copyAssets, build))
}

/**
 * browser-sync 启用http服务
 */
const serveOnline = () => {
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
      baseDir: path.resolve(__dirname, 'www'),
      index: 'index.html',
      middleware: middleware
    },
    port: port,
    open: false,
    notify: false
  })
  // 监听ejs文件的修改
  watch(['./www/**/*.*'], () => {
    return src('./www/**/*.*')
      .pipe(reload({ stream: true })) // 刷新浏览器
  })
}

// 文档数据
exports.generateData = generateData
exports.generateHtml = generateHtml

exports.serveOnline = serveOnline

exports.serve = series(
  delTemp,
  parallel(
    copyAssets,
    series(ejsToHtml, build, serve)
  )
)
exports.default = series(
  delTemp,
  parallel(
    copyAssets,
    series(ejsToHtml, build)
  )
)
