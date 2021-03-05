const { name } = require('./package')
module.exports = {
  // chainWebpack: config => {
  //   config
  //     .plugin('webpack-bundle-analyzer')
  //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '云BI-易仓六扇门'
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'layout-body-background': '#f5f7f9',
          'input-height-base': '30px',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    //  用户中心内嵌需要
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  devServer: {
    hot: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
