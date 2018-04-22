const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const getMode = () =>
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

const output = () => ({
  filename: 'ReactPerfDevtool.js',
  path: path.resolve(__dirname, '../extension/build'),
  publicPath: '/',
  libraryTarget: 'umd'
})

const externals = () => ({
  react: 'react'
})

const jsLoader = () => ({
  test: /\.js$/,
  include: path.resolve(__dirname, '../src'),
  exclude: ['node_modules'],
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
  new UglifyJSPlugin({
    uglifyOptions: {
      compress: false,
      mangle: false,
      keep_fnames: true
    }
  })
]

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: output(),
  target: 'web',
  mode: getMode(),
  externals: externals(),
  module: {
    rules: [jsLoader()]
  },
  plugins: plugins()
}
