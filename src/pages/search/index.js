import ejs from 'ejs/ejs'
import '@assets/plugins/prism/prism.css'
import '@assets/plugins/prism/prism.js'
import '@assets/scss/vendor.scss'
import '@assets/scss/markdown.scss'
import '@assets/scripts/header.js'
import './index.scss'

const pageInit = (allData) => {
  const searchParams = new URLSearchParams(window.location.search)
  const keyword = searchParams.get('keyword')
  const list = allData.filter(item => {
    return (item.keywords.includes(keyword) || new RegExp(keyword).test(item.title) || new RegExp(keyword).test(item.desc))
  })

  const formatDatetime = (dateStr = new Date().getTime(), formatStr = 'yyyy-MM-dd hh:mm:ss') => {
    const date = new Date(dateStr)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(formatStr)) {
      formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return formatStr
  }
  const $g = {
    host: '/',
    formatDatetime,
    mkArticleLink (filepath, filename) {
      return `${$g.host}${filepath.join('/')}/${filename}.html`
    },
    highLight (content) {
      const reg = new RegExp(keyword, 'gim')
      return content.replace(reg, `<em class="high-light">${keyword}</em>`)
    }
  }
  const template = `<h1>找到 <%= list.length %> 篇文档与 “<strong><%= keyword %></strong>” 相关</h1>
  <div class="totonoo--post-list">
  <%
  list.forEach(item => {
  %>
  <div class="item">
    <h3 class="title">
      <a href="<%= global.mkArticleLink(item.filepath, item.filename) %>"><%- global.highLight(item.title) %></a>
    </h3>
    <p class="desc"><%- global.highLight(item.desc)%>...</p>
    <div class="info">
      <ul>
        <li><i class="iconfont icon-folder-close"></i><a href="<%= global.mkArticleLink(item.filepath, 'index') %>"><%= item.catalogueName %></a></li>
        <li><i class="iconfont icon-time"></i><%= global.formatDatetime(item.publishDate) %></li>
        <li>
          <i class="iconfont icon-discount"></i>
          <%
          const _keywords = item.keywords || []
          _keywords.forEach(keyword => {
          %>
          <a href="/search.html?keyword=<%= keyword %>"><%- global.highLight(keyword) %></a>
          <% }) %>                      
        </li>
      </ul>
    </div>
  </div>
  <% }) %>
  </div>`
  const html = ejs.render(template, {
    global: $g,
    list,
    keyword
  })
  document.getElementById('top-search-input').value = keyword
  document.getElementById('search-box').innerHTML = list.length > 0 ? html : `<div class="totonoo--search-empty">Sorry，没有找到与 <strong>${keyword}</strong> 相关的内容</div>`
}

fetch('./all.json', {
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  }
}).then((response) => {
  return response.json()
}).then((res) => {
  pageInit(res || [])
}).catch((_) => {
  pageInit([])
})
