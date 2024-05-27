const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack'); // Import dotenv-webpack

module.exports = {
  transpileDependencies: [],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  pages: {
    index: {
      entry: 'src/main.js',  // Correct path to main.js relative to the frontend directory
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Finbud',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: {
        "process": require.resolve("process/browser"),
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new Dotenv({ // Correctly use Dotenv here
        path: './.env.local', // Load .env.local file
      }),
    ]
  }
};
