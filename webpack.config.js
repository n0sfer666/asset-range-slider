__webpack_base_uri__ = 'http://localhost:9090';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const dir = env.type === 'demo'
    ? './demo'
    : './dist';
  const config = {
    target: 'web',
    stats: 'errors-only',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    entry: { index: `./src/${env.type === 'demo' ? 'demo' : 'index'}.ts` },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, dir),
      library: {
        name: 'simpleRangeSlider',
        type: 'umd',
        umdNamedDefine: true,
        export: 'default',
      },
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ['pug-loader'],
        },
        {
          test: /\.ts$/,
          use: 'ts-loader?configFile=tsconfig.webpack.json',
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: `./src/pages/${ env.type === 'demo' ? 'demo' : 'clean'}/index.pug`,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/favicons', to: 'favicons' },
        ]
      }),
    ],
  };
  if (argv.mode === 'production') {
    if (env.type === 'demo') {
      config.module.rules.push(
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      );
    }
  } else {
    config.devtool = 'source-map';
    config.performance = {
      hints: false,
    }
    config.devServer = {
      contentBase: path.resolve(__dirname, dir),
      compress: true,
      port: 9090,
    };
    config.module.rules.push(
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    );
  }
  return config;
};
