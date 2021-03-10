var Fontmin = require('fontmin')

var srcPath = 'mengnazongyi.otf' // 字体源文件路径
var destPath = 'fontres1' // 字体输出路径
var text = '0123456789帅张和他的朋友们周报第期星球'// 有哪些文字可能需要用到这个字体的,都可以在这里进行配置

// 初始化
var fontmin = new Fontmin()
  .src(srcPath) // 输入配置
  .use(Fontmin.glyph({ // 字型提取插件
    text: text // 所需文字
  }))
  .use(Fontmin.ttf2eot()) // eot 转换插件
  .use(Fontmin.ttf2woff()) // woff 转换插件
  .use(Fontmin.ttf2svg()) // svg 转换插件
  .use(Fontmin.css()) // css 生成插件
  .dest(destPath) // 输出配置

// 执行
fontmin.run(function(err, files, stream) {
  if (err) { // 异常捕捉
    console.error(err)
  }

  console.log('done') // 成功
})
