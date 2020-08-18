module.exports = {
  dist: 'dist',
  tmpDir: '.tmp',
  port: 8080,
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
