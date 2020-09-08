import '@assets/scss/vendor.scss'
import './index.scss'
;(function (window, document) {
  const $ = (id) => {
    return document.getElementById(id)
  }
  const tabs = $('totonoo--tabs')
  const tabsTitle = tabs.querySelector('.tabs-title')
  const tabsContent = tabs.querySelectorAll('.tabs-content')
  const addCurrent = (index) => {
    tabsTitle.querySelectorAll('li').forEach((item, idx) => {
      const classNameArr = item.className.replace(/current/g, '').split(' ')
      console.log(tabsContent[idx].style)
      tabsContent[idx].style.display = 'none'
      if (idx === index) {
        classNameArr.push('current')
        tabsContent[index].style.display = 'block'
      }
      item.className = classNameArr.join(' ')
    })
  }
  const clickHandler = function () {
    const index = +this.dataset.index
    addCurrent(index)
  }
  tabsTitle.querySelectorAll('li').forEach(item => {
    item.onclick = clickHandler
  })
})(window, document)
