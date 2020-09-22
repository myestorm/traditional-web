module.exports = {
  dist: 'dist',
  tmpDir: '.tmp',
  port: 3000,
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
