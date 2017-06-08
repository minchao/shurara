const webpack = require('webpack')
const path = require('path')

module.exports = env => {
    const ifProd = plugin => env == 'production' ? plugin : undefined
    const ifDev = plugin => env == 'development' ? plugin : undefined
    const removeEmpty = array => array.filter(p => !!p)

    console.log('env', env)

    return {
        devtool: ifDev('source-map'),
        entry: {
            app: removeEmpty([
                ifDev('react-hot-loader/patch'),
                ifDev(`webpack-dev-server/client?http://localhost:3000`),
                ifDev('webpack/hot/only-dev-server'),
                path.join(__dirname, './src/index.ts'),
            ]),
            vendor: ['react', 'react-dom', 'mobx', 'mobx-react', 'tslib'],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        output: {
            filename: '[name].js',
            sourceMapFilename: '[name].map.js',
            path: path.join(__dirname, './build/'),
            // publicPath: '/', can uncomment if you want everything relative to root '/'
        },
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
                },
            ],
        },
        plugins: removeEmpty([
            new webpack.HotModuleReplacementPlugin(),
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
        ]),
    }
}
