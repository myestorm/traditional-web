import $ from 'jquery'

$(() => {
  const nav = $('#top-nav-small-nav')
  $('#top-nav-btn').on('click', () => {
    if (nav.is(':hidden')) {
      nav.stop(true, true).show(300)
    } else {
      nav.stop(true, true).hide()
    }
  })
  // copyright
  $('#copyright-years').text('2005 - ' + new Date().getFullYear())
})
