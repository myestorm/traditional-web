# traditional-web

传统网站开发模板

## 如何使用

```powershell
# clone或下载目录
cd traditional-web
npm install -d
npm run serve
# 打包
npm run build
```

## 支持功能

- Typescript
- scss
- iconfont
- eslint
- mocha & chai
- public静态目录
- ejs模板(.ejs | .html)
- js和css分开打包
- 生成页面与css和js的对应关系文件
- 默认引入了jQuery
- webpack 5

## src目录说明

```powershell
|-- assets
|---- font # iconfont
|---- images # css辅助图片
|---- scripts # 公共js
|---- scss # 公共scss
|-- components # 拆分的公共部分
|-- pages # 页面
```

## 页面中如何引用公共模块

```html
<%- require('../../components/header.html')({
  current: 4
})%>
```

## 页面配置文件

```json
{
  "title": "首页", // 页面标题
  "filename": "index", // 构建后生成的文件名
  "template": "index.html", // 模板名称
  "entry": "index.ts" // 入口js
}
```
