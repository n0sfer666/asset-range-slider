const Webpack = require('webpack');
const Copy = require('copy-webpack-plugin');

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
    new Copy({
      patterns: [
        {
          from: 'src/page/',
          to: '',
        },
      ],
    }),
  ],
};
