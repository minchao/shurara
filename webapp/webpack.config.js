const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = (env) => {
  const ifProd = plugin => env.prod ? plugin : undefined;
  const ifDev = plugin => env.dev ? plugin : undefined;
  const removeEmpty = array => array.filter(p => !!p);
  const mode = env.prod ? 'production' : 'development';

  return {
    devtool: ifDev('source-map'),
    mode,
    entry: {
      app: removeEmpty([
        ifDev(`webpack-dev-server/client?http://localhost:${env.port}`),
        ifDev('webpack/hot/only-dev-server'),
        path.join(__dirname, './src/index.ts')
      ]),
    },
    resolve: {
      /*
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: env.prod
            ? 'awesome-typescript-loader?target=es5'
            : 'awesome-typescript-loader',
        },
        {
          test: /\.(css)$/,
          use:
            [
              env.dev || env.test ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader?modules=true&minimize&-autoprefixer',
            ],
        },
        {
          test: /\.(png|jpg)$/,
          use: 'url-loader?limit=8192'
        },
      ],
    },
    output: {
      filename: '[name].[hash].js',
      sourceMapFilename: '[name].[hash].map.js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    optimization: {
      minimize: env.prod,
      splitChunks: {
        chunks: 'all',
      }
    },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: Boolean(env.dev),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new webpack.HotModuleReplacementPlugin(),
      ifDev(new webpack.NamedModulesPlugin()),
      ifProd(new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      })),
    ]),
  };
};
