/* eslint-disable no-undef */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const config = {};

config.entry = {
  app: './src/main.ts',
};

config.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'bundle.js',
};

config.mode = 'development';

config.resolve = {
  extensions: ['.ts', '.js'],
};

config.module = {
  rules: [
    {
      test: /\.ts?$/,
      exclude: /(node_modules)/,
      include: path.resolve(__dirname, 'src/'),
      loader: 'ts-loader',
    },
  ],
};

config.plugins = [
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'public/index.html'),
        to: path.resolve(__dirname, 'dist'),
      },
      {
        from: path.resolve(__dirname, 'public/style.css'),
        to: path.resolve(__dirname, 'dist'),
      },
      {
        from: path.resolve(__dirname, 'assets', '**', '*'),
        to: path.resolve(__dirname, 'dist'),
      },
    ],
  }),
  new webpack.HotModuleReplacementPlugin(),
];

// config.optimization = {
//   splitChunks: {
//     chunks: 'all',
//   },
// };

config.devServer = {
  contentBase: path.resolve(__dirname, './dist'),
  inline: true,
  port: 3000,
  host: '0.0.0.0',
  historyApiFallback: true,
  compress: true,
  hot: true,
};

config.devtool = 'eval-source-map';

module.exports = config;
