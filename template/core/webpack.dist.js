const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const {styleLoaders, htmlPage} = require('./tools')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const usefulModules = ["tab", "popup", "options"];

for (let key in baseWebpack.entry){
    if(usefulModules.indexOf(key) < 0){
        delete  baseWebpack.entry[key];
    }
}

baseWebpack.plugins.splice(2,2);
baseWebpack.plugins.splice(3,1);

baseWebpack.plugins = [
    htmlPage('home', 'app', ['tab']),
    htmlPage('popup', 'popup', ['popup', 'manifest']),
    htmlPage('options', 'options', ['options']),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static') }]),
];


module.exports = merge(baseWebpack, {
    module: {
        rules: styleLoaders({ extract: true, sourceMap: false })
    },
    plugins: [
        new CleanWebpackPlugin(['build'], {dry: true}),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })
    ]
})
