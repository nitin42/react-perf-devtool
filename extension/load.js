require.config({
  paths: {
    react: './dependencies/react',
    'react-dom': './dependencies/react-dom',
    Chart: './dependencies/Chart'
  }
})

requirejs(
  ['react', 'react-dom', 'Chart', '../build/ReactPerfDevtool'],
  function(React, ReactDOM, Chart, { ReactPerfDevtool }) {
    const root = document.getElementById('root')

    ReactDOM.render(
      React.createElement(ReactPerfDevtool, { Graphics: Chart }),
      root
    )
  }
)
