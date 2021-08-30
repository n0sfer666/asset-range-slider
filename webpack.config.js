__webpack_base_uri__ = 'http://localhost:9090';
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  stats: 'errors-only',
  entry: {
    index: './src/index.ts',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
  },
  devServer: {
    contentBase: `${__dirname}/dist`,
    compress: true,
    port: 9090,
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
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/index.pug',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/favicons', to: 'favicons' },
      ]
    }),
  ],
};
