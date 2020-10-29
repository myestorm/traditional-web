# traditional-web

Traditional web development，Multi-page application

## 基本使用方法

``` javascript
npm run serve // 启用本地服务
npm run build // 打包文件
```

## 目录说明

``` javascript
config // 配置
public // 公共资源
src // 项目开发目录
|-- assets
|---- font
|---- images
|---- plugins
|---- scripts
|---- scss
|-- components
|---- ... // 公共的ejs模板
|-- pages
|---- about
|---- index // 首页
|------ config.json // 配置文件
|------ index.ejs // 页面模板
|------ index.js // 页面入口js
|------ index.scss // 页面样式
|---- ...
```

## pages/config.json

```json
{
  "title": "首页", // 页面标题
  "filename": "index" // 生成的文件名称
}
```

## 包含的依赖

- gulp & gulp-rename & gulp-changed
- webpack & webpack-stream & html-webpack-plugin & mini-css-extract-plugin
- browser-sync & http-proxy-middleware

## FAQ

- 页面过多时，自动刷新会慢。更新时使用全量的build。10个左右的页面基本还能接受。大型的项目不推荐使用，主要的目的是为了处理小页面，如活动页之类的。
- `dist/config.json` 这里包含所有页面对应的css和js，且包含应hash版本。
- 模板使用的ejs模板，`pages` 下的ejs模板会首先编译到`.tmp` 下，然后再交给`webpack`处理。
- 默认引入了`jQuery`。
- 模板具体应用的效果，访问[https://wwww.totonoo.com](https://wwww.totonoo.com)。
