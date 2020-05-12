const webpack = require("webpack");

module.exports = {
    // mode: 'production',
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
            '/api/': {
                target: 'http://39.96.54.145',
                ws: true,
                changeOrigin: true,
                // pathRewrite : {
                //     '^/api':''
                // }
            }
        }
    }
}