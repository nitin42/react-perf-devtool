require.config({
  paths: {
    react: "./dependencies/react",
    "react-dom": "./dependencies/react-dom",
  }
});

requirejs(
  ["react", "react-dom", "../build/react-perf-panel.production"],
  function(React, ReactDOM, ReactPerfPanel) {
    const root = document.getElementById("root");
    ReactDOM.render(React.createElement(ReactPerfPanel), root);
  }
);
