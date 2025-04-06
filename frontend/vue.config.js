export default {
  chainWebpack: config => {
      config.module
          .rule('csv')
          .test(/\.csv$/)
          .use('csv-loader')
          .loader('csv-loader')
          .end();
  },
  devServer: {
    proxy: {
      '/multiplier-simulator': {
        target: 'http://localhost:8889',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:8889',
        changeOrigin: true
      }
    }
  }
};
