const webpack = require('webpack');
const copy = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.ts'
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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.(spec|test)\.ts$/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new copy({
      patterns: [
        {
          from: 'src/page/',
          to: '',
        }
      ]
    })
  ],
}