import $ from 'jquery'
export default (maiSscroll = '.totonoo--main-scroll', article = '#totonoo--article', articleNav = '#article-nav') => {
  // 滚动定位位置
  const totonooMainScroll = $(maiSscroll)
  const hgroups = $(article).find('h1, h2, h3, h4, h5, h6')
  const articleNavItems = $(articleNav).find('li')
  const coordinates = []
  hgroups.each((index, item) => {
    coordinates[index] = item.offsetTop
  })
  const setIndex = (scrollTop) => {
    let index = 0
    let offsetTop = 0
    coordinates.forEach((coordinate, idx) => {
      const _offsetTop = Math.abs(coordinate - scrollTop)
      if (_offsetTop < offsetTop) {
        index = idx
      }
      offsetTop = _offsetTop
    })
    articleNavItems.eq(index).addClass('current').siblings().removeClass('current')
  }
  totonooMainScroll.on('scroll', () => {
    const scrollTop = totonooMainScroll.scrollTop()
    setIndex(scrollTop)
  })
  articleNavItems.on('click', function () {
    const index = articleNavItems.index(this)
    const top = coordinates[index] - 20
    $(this).addClass('current').siblings().removeClass('current')
    totonooMainScroll.animate({ scrollTop: top }, 260)
    return false
  })
}
