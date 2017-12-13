const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const output = () => ({
  filename: 'ReactPerfPanel.js',
  path: path.resolve(__dirname, 'extension/build'),
  publicPath: '/',
  libraryTarget: 'umd'
});

// const externals = () => ({
//   "react": "react",
// })

const jsLoader = () => ({
  test: /\.js$/,
  include: path.resolve(__dirname, './src'),
  exclude: ['node_modules'],
  use: 'babel-loader'
});

const plugins = () => (
  [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin()
  ]
);

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: output(),
  target: 'web',
  devtool: 'inline-source-map',
  module: {
    rules: [jsLoader()]
  },
  plugins: plugins()
}
