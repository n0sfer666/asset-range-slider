__webpack_base_uri__ = 'http://localhost:9090';
const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_, argv) => {
  const config = {
    target: 'web',
    stats: 'errors-only',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    entry: argv.mode === 'production'
    ? { index: './src/index.ts' }
    : { index: './src/demo.ts' },
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
      new Webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ]
  };
  if (argv.mode === 'production') {
    config.output = {
      filename: 'index.js',
      path: path.resolve(__dirname, './dist'),
      library: {
        name: 'simpleRangeSlider',
        type: 'umd',
        umdNamedDefine: true,
      },
      globalObject: 'this',
    }
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/pages/production/index.pug',
      }),
    )
  } else {
    config.output = {
      filename: 'index.js',
      path: path.resolve(__dirname, './demo'),
    };
    config.devtool = 'eval';
    config.performance = {
      hints: false,
    }
    config.devServer = {
      contentBase: path.resolve(__dirname, './demo'),
      compress: true,
      port: 9090,
    };
    config.module.rules.push(
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    );
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/pages/demo/index.pug',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/favicons', to: 'favicons' },
        ]
      }),
    )
  }
  return config;
};
