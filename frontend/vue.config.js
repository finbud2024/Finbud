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
            '/api': {
                target: 'https://api.search.brave.com',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
                secure: false,
                onProxyReq: (proxyReq, req, res) => {
                    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
                }
            },
            '/serper': {
                target: 'https://google.serper.dev',
                changeOrigin: true,
                pathRewrite: { '^/serper': '' },
                secure: false,
                onProxyReq: (proxyReq, req, res) => {
                    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
                }
            }
        }
    }
};
