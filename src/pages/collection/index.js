import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/vendor.scss'
import '@assets/scss/markdown.scss'
import './index.scss'
import $ from 'jquery'

$(() => {
  const box = $('#totonoo--box')
  const main = $('#totonoo--main')
  const list = $('#totonoo--list')
  const bar = $('#totonoo--bar')[0]
  const nav = $('#totonoo--nav')

  main.height(window.screen.availHeight - 60 - 75)

  // 窗口改变
  window.onresize = () => {
    main.height(window.screen.availHeight - 60 - 75)
  }

  bar.onmousedown = function (e) {
    const disX = (e || window.event).clientX
    bar.left = bar.offsetLeft

    document.onmousemove = function (e) {
      const minWidth = 160
      const maxWidth = (box.clientWidth - bar.offsetWidth - nav.offsetWidth) / 2
      let width = bar.left + ((e || window.event).clientX - disX)

      if (width < minWidth) {
        width = minWidth
      }
      if (width > maxWidth) {
        width = maxWidth
      }

      bar.style.left = list[0].style.width = width + 'px'
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
      bar.releaseCapture && bar.releaseCapture()
    }

    bar.setCapture && bar.setCapture()
    return false
  }

  // 滚动计算当前文章菜单的位置
  let isScroll = false
  let timer = null
  let prevTop = 0
  const hgroups = $('#totonoo--article').find('h2, h3, h4, h5, h6')
  const offsetTops = []
  hgroups.each((index, item) => {
    offsetTops.push({
      index,
      offsetTop: item.offsetTop
    })
  })
  const addCurrent = (index) => {
    nav.find('li').eq(index).addClass('current').siblings().removeClass('current')
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
  main.on('scroll', (e) => {
    if (!isScroll) {
      const scrollTop = (e || window.event).target.scrollTop
      setIndex(scrollTop)
    }
  })

  // 点击右侧文章
  const clickHandler = function (event) {
    const index = +this.dataset.index
    addCurrent(index)
    isScroll = true
    main.animate({ scrollTop: offsetTops[index].offsetTop - 80 }, 260)
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      isScroll = false
    }, 260)
    event.preventDefault()
    return false
  }
  nav.find('li').each(function () {
    this.addEventListener('click', clickHandler, true)
  })
})

// ;(function (window, document) {
//   const $ = (id) => {
//     return document.getElementById(id)
//   }

//   const box = $('totonoo--box')
//   const main = $('totonoo--main')
//   const list = $('totonoo--list')
//   const bar = $('totonoo--bar')
//   const nav = $('totonoo--nav')

//   main.style.height = `${(window.screen.availHeight - 60 - 75)}px`

//   // 窗口改变
//   window.onresize = () => {
//     main.style.height = `${(window.screen.availHeight - 60 - 75)}px`
//   }

//   // 改变左侧大小
//   window.onload = () => {
//     bar.onmousedown = function (e) {
//       const disX = (e || window.event).clientX
//       bar.left = bar.offsetLeft

//       document.onmousemove = function (e) {
//         const minWidth = 160
//         const maxWidth = (box.clientWidth - bar.offsetWidth - nav.offsetWidth) / 2
//         let width = bar.left + ((e || window.event).clientX - disX)

//         if (width < minWidth) {
//           width = minWidth
//         }
//         if (width > maxWidth) {
//           width = maxWidth
//         }

//         bar.style.left = list.style.width = width + 'px'
//       }
//       document.onmouseup = function () {
//         document.onmousemove = null
//         document.onmouseup = null
//         bar.releaseCapture && bar.releaseCapture()
//       }

//       bar.setCapture && bar.setCapture()
//       return false
//     }
//   }

//   // 滚动计算当前文章菜单的位置
//   let prevTop = 0
//   const hgroups = $('totonoo--article').querySelectorAll('h2, h3, h4, h5, h6')
//   const offsetTops = []
//   hgroups.forEach((item, index) => {
//     offsetTops.push({
//       index,
//       offsetTop: item.offsetTop
//     })
//   })
//   const addCurrent = (index) => {
//     nav.querySelectorAll('li').forEach((item, idx) => {
//       const classNameArr = item.className.replace(/current/g, '').split(' ')
//       if (idx === index) {
//         classNameArr.push('current')
//       }
//       item.className = classNameArr.join(' ')
//     })
//   }
//   const setIndex = (scrollTop = 0) => {
//     const direction = prevTop - scrollTop < 0 ? 1 : -1
//     let index = 0
//     let offsetTop = -100
//     offsetTops.forEach(item => {
//       const _offsetTop = Math.abs(item.offsetTop - scrollTop + (25 * direction))
//       if (offsetTop === -100) {
//         offsetTop = _offsetTop
//         index = item.index
//       } else {
//         offsetTop = offsetTop - _offsetTop < 0 ? offsetTop : _offsetTop
//         index = offsetTop - _offsetTop < 0 ? index : item.index
//       }
//     })
//     addCurrent(index)
//     prevTop = scrollTop
//   }
//   $('totonoo--main').onscroll = (e) => {
//     const scrollTop = (e || window.event).target.scrollTop
//     setIndex(scrollTop)
//   }

//   // 点击右侧文章
//   const clickHandler = function (event) {
//     const index = +this.dataset.index
//     addCurrent(index)
//     event.preventDefault()
//     return false
//   }
//   nav.querySelectorAll('li').forEach(item => {
//     item.onclick = clickHandler
//     item.addEventListener('click', clickHandler, true)
//   })
// })(window, document)
