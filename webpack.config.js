const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const betterWebpackProgress = require('better-webpack-progress');
const StylishPlugin = require('webpack-stylish');


module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  stats: 'none',
  resolve: {
    extensions: [ '.js', '.jsx' ],
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ApolloLinkComputed.js',
    sourceMapFilename: 'ApolloLinkComputed.js.map',
    library: 'ApolloLinkComputed',
    libraryTarget: 'umd',
  },
  externals: [
    'react',
    'react-dom',
  ],
  plugins: [
    new webpack.NamedModulesPlugin(),
    new StylishPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
    new ProgressPlugin(betterWebpackProgress({
      mode: 'bar',
    })),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [ path.resolve(__dirname, 'src') ],
        use: [ 'babel-loader' ],
      },
    ],
  },
};
