var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8000,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/express/public':{
                target:'http://39.108.16.242/express/public',
                changeOrigin:true,
                pathRewrite:{
                    '/express/public':''
                }
            },
            '/express/merchantClient':{
                target:'http://39.108.16.242/express/merchantClient',
                //target:'http://39.108.16.242/express/public',
                changeOrigin:true,
                pathRewrite:{
                    '/express/merchantClient':''
                }
            }
        },
        cssSourceMap: false
    }
}
