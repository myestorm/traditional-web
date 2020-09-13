import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/vendor.scss'
import '@assets/scss/markdown.scss'
import './index.scss'

;(function (window, document) {
  const $ = (id) => {
    return document.getElementById(id)
  }
  const nav = $('totonoo--nav')
  const initNav = () => {
    const initOffsetTop = nav.offsetTop
    const initOffsetLeft = nav.offsetLeft
    nav.style.position = 'fixed'
    nav.style.top = (initOffsetTop + 90) + 'px'
    nav.style.left = (initOffsetLeft + 256) + 'px'
    nav.style.right = 'auto'
  }
  initNav()

  // 滚动计算当前文章菜单的位置
  let prevTop = 0
  const hgroups = $('totonoo--article').querySelectorAll('h2, h3, h4, h5, h6')
  const offsetTops = []
  hgroups.forEach((item, index) => {
    offsetTops.push({
      index,
      offsetTop: item.offsetTop
    })
  })
  const addCurrent = (index) => {
    nav.querySelectorAll('li').forEach((item, idx) => {
      const classNameArr = item.className.replace(/current/g, '').split(' ')
      if (idx === index) {
        classNameArr.push('current')
      }
      item.className = classNameArr.join(' ')
    })
  }
  const setIndex = (scrollTop = 0) => {
    const direction = prevTop - scrollTop < 0 ? 1 : -1
    let index = 0
    let offsetTop = -100
    offsetTops.forEach(item => {
      const _offsetTop = Math.abs(item.offsetTop - scrollTop + (25 * direction))
      if (offsetTop === -100) {
        offsetTop = _offsetTop
        index = item.index
      } else {
        offsetTop = offsetTop - _offsetTop < 0 ? offsetTop : _offsetTop
        index = offsetTop - _offsetTop < 0 ? index : item.index
      }
    })
    addCurrent(index)
    prevTop = scrollTop
  }
  window.onscroll = (e) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    setIndex(scrollTop)
  }

  // 点击右侧文章
  const clickHandler = function () {
    const index = +this.dataset.index
    addCurrent(index)
  }
  nav.querySelectorAll('li').forEach(item => {
    item.onclick = clickHandler
  })
})(window, document)
