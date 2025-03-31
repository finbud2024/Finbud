import { defineConfig } from '@vue/cli-service'

export default defineConfig({
  transpileDependencies: true,
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
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true
      },
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
})