//生产环境构建相关代码
/**
 * 1.loading动画
 * 2.删除创建目标文件
 * 3.webpack编译
 * 4.输出信息
 * 
 * webpack编译之后会输出到配置里面指定的目标文件夹,删除之后在创建是为了去除就得内容
 * 防止产生不可预测的影响
 */

//首先检查node和npm的版本
require('./check-versions')()

process.env.NODE_ENV = 'production'

// Elegant terminal spinner 优雅的终端器
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')

//在控制台输出带颜色字体的插件
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start() //开始loading动画

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})