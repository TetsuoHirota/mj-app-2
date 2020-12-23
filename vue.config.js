const vuetifyOptional =
  process.env.NODE_ENV === "production"
    ? [new (require("vuetify-loader/lib/plugin"))()]
    : [];

module.exports = {
  configureWebpack: {
    plugins: [...vuetifyOptional],
    performance: {
      maxEntrypointSize: 1500000,
      maxAssetSize: 1500000,
    },
  },
  transpileDependencies: vuetifyOptional.length > 0 ? ["vuetify"] : [],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "./src/assets/scss/main.scss";',
      },
    },
  },
};
