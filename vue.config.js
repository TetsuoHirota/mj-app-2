module.exports = {
  publicPath: '/',
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "./src/assets/scss/main.scss";'
      }
    }
  },
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false
  //   }
  // },
  configureWebpack: {
    performance: {
      maxEntrypointSize: 1500000,
      maxAssetSize: 1500000,
    }
  },
}