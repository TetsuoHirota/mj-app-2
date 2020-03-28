module.exports = {
  publicPath: '/',
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  configureWebpack: {
    performance: {
      maxEntrypointSize: 1500000,
      maxAssetSize: 1500000,
    }
  },
}