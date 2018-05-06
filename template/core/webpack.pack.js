const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const {styleLoaders, htmlPage} = require('./tools')
const ManifestJsonPlugin = require("../tool/ManifestJsonPlugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


let resolve = dir => path.join(__dirname, '..', 'src', dir)



const usefulModules = ["tab", "popup", "options", "background", "inject"];

for (let key in baseWebpack.entry) {
    if (usefulModules.indexOf(key) < 0) {
        delete  baseWebpack.entry[key];
    }
}

baseWebpack.plugins = [
    htmlPage('home', 'app', ['tab']),
    htmlPage('popup', 'popup', ['manifest', "vendor", 'popup']),
    htmlPage('options', 'options', ['manifest', "vendor", 'options']),
    htmlPage('background', 'background', ['manifest', "vendor", 'background']),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static') }])
];

module.exports = merge(baseWebpack, {
    // cheap-module-eval-source-map
    watch: false,
    module: {
        rules: styleLoaders({extract: true, sourceMap: false})
    },
    plugins: [
        new CleanWebpackPlugin(["build/*.*", "build/*/*.*"], {
            root: process.cwd()
        }),
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
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new ManifestJsonPlugin({path: resolve("manifest.js")}),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, "..", 'node_modules')
                    ) === 0
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            chunks: ['vendor']
        }),
    ]
});