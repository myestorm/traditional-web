import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/vendor.scss'
import '@assets/scss/markdown.scss'
import './index.scss'

;(function (window, document, undefined) {
  const $ = (selector) => {
    return document.querySelector(selector)
  }
  const availHeight = window.screen.availHeight
  $('.totonoo--collection-article').style.height = `${(availHeight - 60 - 72)}px`
})(window, document)
