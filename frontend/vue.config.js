const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack'); // Import dotenv-webpack
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Import CopyWebpackPlugin

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
        "assert": require.resolve('assert'),
        "stream": require.resolve('stream-browserify'),
        "util": require.resolve('util/'),
        "crypto": require.resolve('crypto-browserify'),
        // "url": require.resolve('url/'),
        "querystring": require.resolve('querystring-es3'),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "fs": false,  // or use 'require.resolve("browserify-fs")' if needed
        "net": false,  // or use 'require.resolve("net-browserify")' if needed
        "tls": false,  // or use 'require.resolve("tls-browserify")' if needed
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      // Example: copying a file (replace with actual logic for benchmark.csv)
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../data/benchmark.csv'),
            to: path.resolve(__dirname, 'dist/benchmark.csv') // Adjust output path as needed
          }
        ]
      })
    ]
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.xlsx$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/files/',
              },
            },
          ],
        },
      ],
    },
  },
};
