const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = env => {
    const ifProd = plugin => env == 'production' ? plugin : undefined
    const ifDev = plugin => env == 'development' ? plugin : undefined
    const removeEmpty = array => array.filter(p => !!p)

    return {
        devtool: ifDev('source-map'),
        entry: {
            main: removeEmpty([
                ifDev('react-hot-loader/patch'),
                ifDev(`webpack-dev-server/client?http://localhost:3000`),
                ifDev('webpack/hot/only-dev-server'),
                path.join(__dirname, './src/index.tsx'),
            ]),
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        output: {
            filename: '[name].[hash].js',
            sourceMapFilename: '[name].[hash].map.js',
            path: path.resolve(__dirname, 'dist'),
            // publicPath: '/', can uncomment if you want everything relative to root '/'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader',
                    })
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        'file-loader'
                    ]
                },
            ],
        },
        plugins: removeEmpty([
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // this assumes your vendor imports exist in the node_modules directory
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin('styles.css'),
            ifProd(new webpack.optimize.UglifyJsPlugin({
                compress: {
                    'screw_ie8': true,
                    'warnings': false,
                    'unused': true,
                    'dead_code': true,
                },
                output: {
                    comments: false,
                },
                sourceMap: false,
            })),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                filename: 'index.html',
                inject: 'body',
            }),
        ]),
    }
}
