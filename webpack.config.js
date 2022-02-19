const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist/webpack'),
        filename: 'bundle.[contenthash:10].js',
    },
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.jsx',],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx|.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ["@babel/preset-env"],
                            ["@babel/preset-react"]
                        ]
                    }
                }
            },
        ],
    },
    mode:'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
    mode: 'development',
    devServer: {
        compress: true,
        port: 9000,
        open: true,
    },
}