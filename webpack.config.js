const path = require("path"),
    webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    ManifestRevisionPlugin = require("manifest-revision-webpack-plugin"),
    WebpackMd5Hash = require('webpack-md5-hash');

var root = "./Resources/Assets/";
var jsRoot = "./Resources/Assets/js/";
var scssRoot = "./Resources/Assets/scss/";
var pluginRoot = ".Resources/Assets/plugins/";

var entries = {
    main_css: [
        scssRoot + "main.scss"
    ],
    main_header_js: [
        jsRoot + "pages/main/header.jsx"
    ],
    main_footer_js: [
        jsRoot + "pages/main/footer.jsx"
    ],
    main_home_css: [
        scssRoot + "pages/main/home.scss"
    ],
    main_home_js: [
        jsRoot + "pages/main/home.jsx"
    ],
    main_article_css: [
        scssRoot + "pages/main/article.scss"
    ],
    main_article_js: [
        jsRoot + "pages/main/article.jsx"
    ],
    admin_css: [
        scssRoot + "admin.scss"
    ],
    admin_header_js: [
        jsRoot + "pages/admin/header.jsx"
    ],
    admin_login_css: [
        scssRoot + "pages/admin/login.scss"
    ],
    admin_login_js: [
        jsRoot + "pages/admin/login.jsx"
    ],
    admin_repo_css: [
        scssRoot + "pages/admin/repo.scss"
    ],
    admin_repo_js: [
        jsRoot + "pages/admin/repo.jsx"
    ],
    admin_posts_css: [
        scssRoot + "pages/admin/posts.scss"
    ],
    admin_posts_js: [
        jsRoot + "pages/admin/posts.jsx"
    ],
    admin_addArticle_css: [
        scssRoot + "pages/admin/addArticle.scss"
    ],
    admin_addArticle_js: [
        jsRoot + "pages/admin/addArticle.jsx"
    ],
    admin_editArticle_css: [
        scssRoot + "pages/admin/editArticle.scss"
    ],
    admin_editArticle_js: [
        jsRoot + "pages/admin/editArticle.jsx"
    ],
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
                test: /\.(jsx|js)?$/,
                exclude: [/node_modules/],
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: ['url-loader?limit=100000', 'file-loader']
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