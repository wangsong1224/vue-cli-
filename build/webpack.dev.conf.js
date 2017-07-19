/**
 * 1.将hot-reload相关的代码添加到entry chunks
 * 2.合并基础的webpack配置
 * 3.使用styleLoaders
 * 4.配置Source Maps
 * 5.配置webpack插件
 *  **/

var utils = require('./utils')
var webpack = require('webpack')

//使用 config/index.js
var config = require('../config')

//使用 webpack 配置合并插件 可以合并数组和对象
var merge = require('webpack-merge')

//加载 webpack.base.conf
var baseWebpackConfig = require('./webpack.base.conf')

//自动生成 html 并注入到 .html 文件中
var HtmlWebpackPlugin = require('html-webpack-plugin')

//
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
// 将将 hot-reload 相对路径添加到 webpack.base.conf 的对应 entry 前
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


//将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
module.exports = merge(baseWebpackConfig, {
    module: {
        //配置样式文件的处理规则,使用styleLoaders
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map 在开发时更快
    // 使用 #eval-source-map 模式作为开发工具，此配置可参考 DDFE 往期文章详细了解
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // definePlugin 接收字符串插入到代码中,所以当你需要的话可以写上 JS 的字符串
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),

        //HotModule 插件在页面进行变更的时候只会重绘对应的页面模块,不会重绘整个 html 文件
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),

        //使用了 NoErrorsPlugin 后页面中的报错不会阻塞,但是会在编译结束后报错
        // https://github.com/ampedandwired/html-webpack-plugin        
        new webpack.NoEmitOnErrorsPlugin(),

        //将 index.html 作为入口,注入 html 代码后生成 index.html 文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
})