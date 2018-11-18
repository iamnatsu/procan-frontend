const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',
 
  watchOptions: {
    poll: 2000
  },
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: ['./app/App.tsx', './app/sass/style.scss'],
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/app/dist`,
    // 出力ファイル名
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        // 拡張子 .ts もしくは .tsx の場合
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      /*
      {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: ExtractTextPlugin.extract({
          use:
            [
            // CSSをバンドルするための機能
            {
              loader: 'css-loader',
              options: {
                // オプションでCSS内のurl()メソッドの取り込みを禁止する
                url: false,
                // ソースマップの利用有無
                sourceMap: true,

                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
                importLoaders: 2
              },
            },
            {
              loader: 'sass-loader',
              options: {
                // ソースマップの利用有無
                sourceMap: true,
              }
            }
          ]
        }),
      }*/

    ]
  },
  // import 文で .ts や .tsx ファイルを解決するため
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.json'
    ],
  },

  plugins: [
    // new ExtractTextPlugin('style.css'),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "style.css"
    }),
    new TsconfigPathsPlugin({ configFile: `${__dirname}/tsconfig.json` })
  ],
};