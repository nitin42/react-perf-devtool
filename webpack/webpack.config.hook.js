const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const getMode = () =>
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

const output = () => ({
  filename: 'devtool-hook.js',
  path: path.resolve(__dirname, '../lib'),
  publicPath: '/',
  libraryTarget: 'umd'
})

const externals = () => ({
  react: 'react'
})

const jsLoader = () => ({
  test: /\.js$/,
  include: [
    path.resolve(__dirname, '../src/npm'),
    path.resolve(__dirname, '../src/shared')
  ],
  exclude: [
    path.resolve(__dirname, '../src/extension'),
    'node_modules',
    'samples',
    'art',
    'extension'
  ],
  use: 'babel-loader'
})

const plugins = () => [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new UglifyJSPlugin()
]

module.exports = {
  entry: path.resolve(__dirname, '../src/hook.js'),
  output: output(),
  target: 'web',
  mode: getMode(),
  externals: externals(),
  module: {
    rules: [jsLoader()]
  },
  plugins: plugins()
}
