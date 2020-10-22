import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/markdown.scss'
import '@assets/scss/vendor.scss'
import './index.scss'
import $ from 'jquery'
import Nav from '@assets/scripts/nav.js'

$(() => {
  const detailMain = $('#detail-main')
  const detailArticle = $('#detail-article')
  const articleNav = $('#article-nav')
  const setDomWidth = () => {
    if (articleNav.length > 0) {
      const width = document.body.clientWidth
      detailMain.width(width - 48)
      detailArticle.width(width - 260 - 50 - 48)
      articleNav.width(260)
    }
  }
  setDomWidth()
  $(window).on('resize', () => {
    setDomWidth()
  })
  // 滚动定位位置
  Nav()
})
