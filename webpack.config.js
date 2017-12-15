const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const output = () => ({
  filename: 'react-perf-panel.production.js',
  path: path.resolve(__dirname, 'extension/build'),
  libraryTarget: 'umd',
})

// const externals = () => ({
//   'prop-types': 'prop-types',
// })

const jsLoader = () => ({
  test: /\.js$/,
  include: path.resolve(__dirname, './src'),
  exclude: ['node_modules', 'extension', 'trash'],
  use: 'babel-loader',
})

const plugins = () => [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': 'production',
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new UglifyJSPlugin(),
]

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: output(),
  target: 'web',
  module: {
    rules: [jsLoader()],
  },
  plugins: plugins(),
}
