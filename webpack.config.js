const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  devServer: {
    contentBase: __dirname + '/dist',
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
  ],
}