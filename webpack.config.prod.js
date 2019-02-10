const webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function srcPath(subdir) {
  return path.join(__dirname, subdir);
}

module.exports = [{
  mode: 'production',
  entry: ['url-search-params-polyfill', './app/App.tsx'],
  output: {
    path: __dirname + '/build/tmp/dist/',
    filename: 'app.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: srcPath('app/src'),
      types: srcPath('types')
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'ts-loader'}
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
    /*
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          inline: 1,
        }
      }
    }),
    */
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
}, {
  entry: {
    style: [
      './app/sass/style.scss'
    ]
  },
  output: {
    path: __dirname + '/build/tmp/dist/',
    filename: 'style.css'
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?minimize'
        })
      }, {
        test: /\.scss?$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?sourceMap=true&minimize', 
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                minimize: true
              }
            }
          ]
        })
      }, {
        test: /\.(png|jpg)$/,
        loaders: 'url-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
  ]
}];