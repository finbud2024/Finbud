// vue.config.js
export default {
  chainWebpack: (config) => {
    config.module
      .rule("csv")
      .test(/\.csv$/)
      .use("csv-loader")
      .loader("csv-loader")
      .options({
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      })
      .end();
  },
  devServer: {
    proxy: {
      "/v8": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
};
