module.exports = {
  dist: 'dist',
  tmpDir: '.tmp',
  port: 8080,
  proxys: {
    '/api': {
      target: 'http://www.totonoo.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
