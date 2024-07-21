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
            entry: 'src/main.js', // Correct path to main.js relative to the frontend directory
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Finbud',
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                'vue$': 'vue/dist/vue.esm.js'
            },
            fallback: {
                "process": require.resolve("process/browser"),
            }
        },
        module: {
            rules: [{
                test: /\.csv$/,
                use: 'raw-loader'
            }]
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            }),
            new webpack.DefinePlugin({
                '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false, // Ensure it's set to false for production
                '__VUE_OPTIONS_API__': true,
            }),
            new Dotenv()
        ]
    }
};