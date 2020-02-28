const webpack = require("webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost/api',
                ws: true,
                changeOrigin: true,
                // pathRewrite : {
                //     '^/api':''
                // }
            }
        }
    }
}