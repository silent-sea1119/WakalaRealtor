const path = require("path"),
    webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    ManifestRevisionPlugin = require("manifest-revision-webpack-plugin"),
    WebpackMd5Hash = require('webpack-md5-hash');

var root = "./Resources/assets/";
var jsRoot = "./Resources/assets/js/";
var scssRoot = "./Resources/assets/scss/";

var entries = {
    main_css: [
        scssRoot + "main.scss"
    ],
    main_js: [
        jsRoot + "svg_icon.js"
    ],
    main_header_js: [
        jsRoot + "pages/main/header.jsx"
    ],
    main_footer_js: [
        jsRoot + "pages/main/footer.jsx"
    ],
    admin_login_css: [
        scssRoot + "pages/admin/login.scss"
    ],
    admin_login_js: [
        jsRoot + "pages/admin/login.jsx"
    ]
}

const config = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'Public/assets'),
        publicPath: "http://127.0.0.1:5000/assets/",
        filename: "[name].[chunkhash].js",
        chunkFilename: "[id].[chunkhash].chunk"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }, 
        {
            test: /\.scss$/,
            use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            use: ['url-loader?limit=100000','file-loader']
        }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
          }),
        new ManifestRevisionPlugin("./manifest.json", {
            rootAssetPath: root
        }),
        new WebpackMd5Hash()
    ]
};

module.exports = config;