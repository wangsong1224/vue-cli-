//检查node npm等版本相关代码

//定制控制台日志的输出样式
var chalk = require('chalk')

//加载语义化版本测试库
var semver = require('semver')

//引入 package.json 文件
var packageConfig = require('../package.json')

//shell是在NODEJS API之上的Unix shell命令的实现。
//消除shell脚本对Unix的依赖，保持其熟悉的命令。
var shell = require('shelljs')

//
function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim()
}

//定义 node 和 npm 版本需求所组成的数组
var versionRequirements = [{
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
}, ]

//
if (shell.which('npm')) {
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    })
}

module.exports = function() {
    var warnings = []

    //依次判断版本是否符合要求
    for (var i = 0; i < versionRequirements.length; i++) {
        var mod = versionRequirements[i]
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(mod.name + ': ' +
                chalk.red(mod.currentVersion) + ' should be ' +
                chalk.green(mod.versionRequirement)
            )
        }
    }

    if (warnings.length) {
        console.log('')
        console.log(chalk.yellow('To use this template, you must update following to modules:'))
        console.log()
        for (var i = 0; i < warnings.length; i++) {
            var warning = warnings[i]
            console.log('  ' + warning)
        }
        console.log()
        process.exit(1)
    }
}