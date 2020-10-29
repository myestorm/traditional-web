import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/markdown.scss'
import '@assets/scss/vendor.scss'
import '@assets/scripts/header.js'
import './index.scss'
import $ from 'jquery'
import Nav from '@assets/scripts/nav.js'

$(() => {
  const detailMain = $('#detail-main')
  const detailArticle = $('#detail-article')
  const totonooAside = $('#totonoo--aside')
  const articleNav = $('#article-nav')
  if (document.body.clientWidth > 980) {
    const setDomWidth = () => {
      if (articleNav.length > 0) {
        const width = document.body.clientWidth
        detailMain.width(width - 186 - 15 - 37.5)
        totonooAside.width(186)
        detailArticle.width(width - 260 - 186 - 15 - 37.5 - 86)
        articleNav.width(260)
      }
    }
    setDomWidth()
    $(window).on('resize', () => {
      setDomWidth()
    })

    // 滚动定位位置
    Nav()
  } else {
    const width = document.body.clientWidth
    detailArticle.width(width - 36)
  }
})
