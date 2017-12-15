require.config({
  paths: {
    react: "./dependencies/react",
    "react-dom": "./dependencies/react-dom"
  }
});

requirejs(["react", "react-dom", "../build/ReactPerfDevtool"], function(
  React,
  ReactDOM,
  ReactPerfDevtool
) {
  const root = document.getElementById("root");
  ReactDOM.render(React.createElement(ReactPerfDevtool), root);
});
