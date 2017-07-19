/**
 * 主要完成以下几件事
 * 1.配置webpack的编译入口
 * 2.配置webpack的输出路径和命名规则
 * 3.配置模块的resolve规则
 * 4.配置不同类型模块的处理规则
 * **/

var path = require('path')
var utils = require('./utils')
var config = require('../config')

//
var vueLoaderConfig = require('./vue-loader.conf')

//给出正确的绝对路径
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {

    // 编译文件入口
    entry: {
        app: './src/main.js'
    },

    //编译输出路径和命名规则
    output: {
        //编译输出的根路径
        path: config.build.assetsRoot,
        //编译输出的文件名
        filename: '[name].js',
        //正式发布环境下编译输出的发布路径
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },

    //配置模块resolve的规则
    resolve: {

        // 自动补全的扩展名
        extensions: ['.js', '.vue', '.json'],

        //resolve模块的时候要搜索的文件夹
        // modules: [

        // ],

        //创建路径别名,用别名引用模块更方便
        alias: {
            //默认路径代理,例如 import Vue from 'vue',会自动到'vue/dist/vue.esm'中寻找
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            // 原来是这种写法 为毛上面的省略了path?
            // 'components':path.resolve(__dirname,'../src/component')
        }
    },

    //配置不同类型模块的处理规则
    module: {
        rules: [{
                //对src和test文件夹下的.js和.vue文件使用eslint-loader
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                //对所有.vue文件使用vue-loader
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                // 对src和test文件夹下的.js文件使用babel-loader
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                // 对图片资源文件使用url-loader，options.name指明了输出的命名规则
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                // 对视频资源文件使用url-loader，options.name指明了输出的命名规则
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, //低于10000字节(10k)的使用url-loader加载器 超过的使用file-loader加载器
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                // 对字体资源文件使用url-loader，options.name指明了输出的命名规则
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}