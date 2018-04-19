// Webpack4, server用
// https://github.com/angular/universal-starter/issues/505
const path = require('path');
const webpack = require( 'webpack' );

module.exports = {
    mode: 'development',
    entry: './bin/www.ts',          // 依存関係の起点
    target: 'node',                 // node.js用
    node: {
          __dirname: false,         // __dirname, __filename は置き換えない
          __filename: false,
    },
    output : {
      // dist フォルダに格納する(この場で __dirname を解決するため、``で囲んでいる
        path: `${__dirname}/../dist/server`,
        filename: '[name].js'       // main.js になる
    },
    devtool: 'source-map',          // mapファイル(実行には関係ない)
    resolve: {
        // import, require で指定したモジュールを探すときの拡張子
      // .node など拡張子が増えたら反映する
        extensions:['.ts', '.webpack.js', '.web.js', '.js']
    },
    module : {
        rules: [
            {
                // .ts ファイル はts-loaderが処理する。
                // 指定が無ければ、同階層の tsconfig.json を使用してトランスパイルする
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ]
              }
        ],
    },
    externals: [],
    plugins:[  ],
};
