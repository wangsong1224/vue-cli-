/** 
 * 1.检查node和npm的版本
 * 2.引入相关的插件和配置
 * 3.创建express服务和webpack编译器
 * 4.配置开发中间件(webpack-dev-middleware)和热重载中间件(webpack-hot-middleware)
 * 5.挂载代理服务和中间件
 * 6.配置静态资源
 * 7.启动服务器监听特定端口
 * 8.自动打开浏览器并打开特定的网址(localhost:8080)
 * 
 * **/

/**
 * 说明:express服务器提供静态文件服务，不过它还使用了http-proxy-middleware，
 * 一个http请求代理的中间件。前端开发过程中需要使用到后台的API的话，
 * 可以通过配置proxyTable来将相应的后台请求代理到专用的API服务器。
 **/

// 检查node和npm的版本
require('./check-versions')()

//获取 config/index.js 的默认配置
var config = require('../config')

// 如果 node 的环境无法判断当前是 dev/product 环境
// 使用 config.dev.env.NODE_EVN 作为当前的环境
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

//一个可以调用默认软件打开网址,图片,文件内容的插件
//一个可以强制打开浏览器并跳转到制定 url 的插件
//这里用来调用默认浏览器打开dev-server监听的端口 比如:localhost:8080
var opn = require('opn')

//使用 nodejs 自带的文件路径工具
var path = require('path')

//使用 express
var express = require('express')

//使用 webpack
var webpack = require('webpack')

//一个express红渐渐,用于将http请求代理到其他服务器
// 例如:localhost:8080/api/xxx --> localhost:3000/api/xxx
// 这里使用该插件将前端开发中涉及到的请求代理到API服务器上,方便与服务器对接
// 使用 ProxyTable 单线程node.js代理中间件,用于连接,快速和浏览器同步
var proxyMiddleware = require('http-proxy-middleware')

//使用 dev 环境的 webpack 配置(是'testing'使用生产环境)
var webpackConfig = process.env.NODE_ENV === 'testing' ?
    require('./webpack.prod.conf') :
    require('./webpack.dev.conf')

//dev-server监听的端口
// 如果没有指定运行端口,使用 config.dev.port 作为运行端口
var port = process.env.PORT || config.dev.port

// 自动打开浏览器, 默认是false
var autoOpenBrowser = !!config.dev.autoOpenBrowser

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
//使用 config.dev.proxyTable 的配置作为 proxyTable 的代理配置
var proxyTable = config.dev.proxyTable

// 使用 express 启动一个服务
var app = express()

//启动 webpack 进行编译
var compiler = webpack(webpackConfig)

// webpack-dev-middleware使用compiler对象来对相应的文件进行编译和绑定
// 启动 webpack-dev-middleware 将编译后的文件暂存到内存中
//将这个中间件交给express使用之后即可访问这些遍以后的产品文件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

//启动 webpack-hot-middleware 也就是常说的 Hot-reload
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {},
    heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
//当 html-webpack-plugin 模板改变时强制页面刷新
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// proxy api requests
// 将 proxyTable 中的请求配置挂载到启动的 express 服务上
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 使用 connect-history-api-fallback 匹配资源,如果不匹配就可以重定向到指定地址 常用语SPA
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 将暂存到内存中的 webpack 编译后的文件挂载到 express 服务上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将 Hot-reload 挂载到 express 服务上
app.use(hotMiddleware)

// serve pure static assets
// 拼接 static 文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)

// 将静态资源挂到 express 服务器上
app.use(staticPath, express.static('./static'))

//应用的地址信息,例如 http://localhost:8080
var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')

//webpack开发中间件合法(valid)之后输出提示语到控制台,表明服务器已启动
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        // 如果是测试环境 没必要打开它
        //如果符合自动打开浏览器的条件,则通过opn插件帝欧用系统磨人的浏览器打开对应的地址url
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})

//启动express服务器并监听相应的端口(8080)
// 让我们这个 express 服务监听 port 的请求,并将此服务作为 dev-server.js 的接口暴露
var server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}