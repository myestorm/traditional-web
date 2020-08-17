module.exports = {
  dist: 'dist',
  tmpDir: '.tmp',
  proxys: {
    '/api': {
      target: 'http://www.baidu.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
