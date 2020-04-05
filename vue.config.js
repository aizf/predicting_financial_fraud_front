const path = require('path')
const debug = process.env.NODE_ENV !== 'production'
//const VueConf = require('./src/assets/js/libs/vue_config_class')
//const vueConf = new VueConf(process.argv)



module.exports = {
  // 根域上下文目录
  publicPath: !debug
    ? '/predicting_financial_fraud/'
    : '/',

  // outputDir: 'dist', // 构建输出目录
  // 静态资源目录 (js, css, img, fonts)
  assetsDir: 'assets',

  outputDir: 'D:/Documents/GitHub/aizf.github.io/predicting_financial_fraud',
  indexPath: 'index.html',

  // lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  // runtimeCompiler: true, // 运行时版本是否需要编译
  // transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  productionSourceMap: false,
  devServer: {
    host: '127.0.0.1',
    hot: true
  },
  configureWebpack: config => { 
    Object.assign(config, { // 开发生产共同配置，配置别名
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          // 'vue$': 'vue/dist/vue.esm.js'
        }
      }
    })
  },

  runtimeCompiler: undefined,
  parallel: undefined,
  css: undefined
}
