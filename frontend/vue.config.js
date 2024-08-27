// vue.config.js
module.exports = {
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
        secure: false, // Add this line if you are using a self-signed certificate
      },
    },
  },
};
