const {
  Transform,
  Readable
} = require('readable-stream')
const MarkdownIt = require('markdown-it')
const frontMatter = require('front-matter')
const pinyin = require('pinyin')
const {
  series,
  src,
  dest
} = require('gulp')
const Vinyl = require('vinyl')
const path = require('path')

const config = {
  documents: 'documents',
  data: 'data',
  pagesize: 10 // 分页大小
}

// 统计文件数量 生成分页列表
const countInfo = {}

/**
 * 生成分类数据
 */
const readREADME = () => {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      const fmContents = frontMatter(file.contents.toString())
      const data = {
        ...fmContents.attributes // 提取yaml参数
      }
      // markdown解析器
      const markdownIt = new MarkdownIt()
      const body = markdownIt.render(fmContents.body)
      data.body = body
      data.path = path.relative(`${path.join(__dirname, '../')}/${config.documents}`, file.dirname).replace(/\\/g, '/')
      countInfo[data.path] = {
        count: 0,
        pagesize: config.pagesize,
        list: []
      }

      file.basename = 'index'
      file.extname = '.json'
      file.contents = Buffer.from(JSON.stringify(data))
      callback(null, file)
    }
  })
}
const generateCategoryJson = () => {
  return src(`./${config.documents}/**/README.md`)
    .pipe(readREADME())
    .pipe(dest(`./${config.data}`))
}

/**
 * 根据目录生成文章数据
 */
const readArticle = () => {
  return new Transform({
    objectMode: true,
    transform: function (file, encoding, callback) {
      const fmContents = frontMatter(file.contents.toString())
      const data = {
        ...fmContents.attributes // 提取yaml参数
      }
      // markdown解析器
      const navigation = [] // 右侧导航
      const markdownIt = new MarkdownIt().use(require('markdown-it-anchor'), {
        level: 1,
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '¶',
        callback: (token, {
          slug,
          title
        }) => {
          navigation.push({
            tag: token.tag,
            slug,
            title
          })
        }
      })

      // 解析正文
      const body = markdownIt.render(fmContents.body)
      data.body = body
      // 文章路径
      data.path = path.relative(`${path.join(__dirname, '../')}/${config.documents}`, file.dirname).replace(/\\/g, '/')
      data.navigation = navigation

      const basename = file.basename.replace(file.extname, '')

      const arr = basename.split('.')
      // 排序
      data.orderIndex = Number(arr[0]) ? Number(arr[0]) : 999

      // 文件名称（汉语转换成拼音）
      const filename = basename.replace(/^[0-9]+\./, '').replace(/\s+/g, '-').replace(/[，|。]/g, '')
      data.filename = pinyin(filename, {
        style: pinyin.STYLE_NORMAL
      }).join('-').toLowerCase()
      file.basename = data.filename

      file.extname = '.json'
      file.contents = Buffer.from(JSON.stringify(data))
      // 统计数量
      countInfo[data.path].count++
      countInfo[data.path].list.push(data)

      callback(null, file)
    }
  })
}
const generateArticle = () => {
  return src([`./${config.documents}/**/*.md`, `!./${config.documents}/**/README.md`])
    .pipe(readArticle())
    .pipe(dest(`./${config.data}`))
}

/**
 * 添加文件
 * @param {String} filename 文件名
 * @param {String} string 内容
 */
const addVinylFile = (filename, string) => {
  const src = Readable({
    objectMode: true
  })
  src._read = function () {
    this.push(new Vinyl({
      path: filename,
      contents: Buffer.from(string)
    }))
    this.push(null)
  }
  return src
}

/**
 * 所有格式化数据
 */
const generateAllData = () => {
  return addVinylFile('all.json', JSON.stringify(countInfo))
    .pipe(dest(`./${config.data}`))
}

module.exports = series(generateCategoryJson, generateArticle, generateAllData)
