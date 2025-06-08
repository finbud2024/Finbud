const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.csv$/,
          use: [
            {
              loader: 'csv-loader',
              options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true
              }
            }
          ]
        },
        {
          test: /node_modules[\\/](pdfjs-dist|@tanstack[\\/]query-core)[\\/].*\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@vue/cli-plugin-babel/preset'],
              plugins: [
                '@babel/plugin-transform-private-methods',
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-private-property-in-object'
              ]
          }
        }
        }
      ]
      }
    },
  chainWebpack: config => {
    // Exclude problematic dependencies from babel processing
    config.module
      .rule('js')
      .exclude
      .add(/node_modules[\\/](pdfjs-dist|@tanstack)/)
      .end()
  }
});
