require.config({
  paths: {
    react: "./third_party/react",
    "react-dom": "./third_party/react-dom",
  }
});

requirejs(
  ["react", "react-dom", "../build/ReactPerfPanel"],
  function(React, ReactDOM, ReactPerfPanel) {
    const root = document.getElementById("root");
    ReactDOM.render(React.createElement(ReactPerfPanel), root);
  }
);
