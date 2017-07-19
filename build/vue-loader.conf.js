/**
 * 1.配置静态资源路径
 * 2.生成CSSLoader用于加载 .vue文件
 * 3.申城styleLoaders用于加载不在.Vue文件中的单独存在的样式文件 
 * vue-loader.conf则只配置了css加载器以及编译css之后自动添加前缀
 */

var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    //css加载器
    loaders: utils.cssLoaders({
        sourceMap: isProduction ?
            config.build.productionSourceMap : config.dev.cssSourceMap,
        extract: isProduction
    }),

    //
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}