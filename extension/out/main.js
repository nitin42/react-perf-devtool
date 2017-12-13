(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "react"], factory);
  }
})(function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  const React = require("react");
  let previousMeasures = [];
  function readReactPerformanceData(measures) {
    console.log(measures);
    const index = {};
    for (const measure of measures) {
      console.log(measure);
      const [componentName, phase] = measure.name.split(" ");
      if (!index[componentName]) {
        index[componentName] = {
          mount: {
            timeSpent: []
          },
          unmount: {
            timeSpent: []
          },
          update: {
            timeSpent: []
          },
          render: {
            timeSpent: []
          }
        };
      }
      if (phase === "[mount]") {
        index[componentName].mount.timeSpent.push(measure.duration);
      }
      if (phase === "[unmount]") {
        index[componentName].unmount.timeSpent.push(measure.duration);
      }
      if (phase === "[update]") {
        index[componentName].update.timeSpent.push(measure.duration);
      }
      if (phase === "[render]") {
        index[componentName].render.timeSpent.push(measure.duration);
      }
    }
    return index;
  }
  function sum(nums) {
    return Math.round(
      Number(nums.reduce((acc, v) => (acc += v), 0).toFixed(2))
    );
  }
  function average(nums) {
    if (nums.length === 0) {
      return "-";
    }
    return (nums.reduce((acc, v) => (acc += v), 0) / nums.length).toFixed(1);
  }
  function mapData(index) {
    const componentByTotalTime = {};
    for (let componentName in index) {
      componentByTotalTime[componentName] =
        componentByTotalTime[componentName] || 0;
      componentByTotalTime[componentName] += sum(
        index[componentName].mount.timeSpent
      );
      componentByTotalTime[componentName] += sum(
        index[componentName].unmount.timeSpent
      );
      componentByTotalTime[componentName] += sum(
        index[componentName].update.timeSpent
      );
    }
    const components = Object.keys(componentByTotalTime).reduce((acc, key) => {
      acc.push({ name: key, totalTime: componentByTotalTime[key] });
      return acc;
    }, []);
    const allComponentsTotalTime = components.reduce(
      (acc, component) => (acc += component.totalTime),
      0
    );
    const percent = num => Math.round(num * 100) + "%";
    const r = components.sort((a, b) => b.totalTime - a.totalTime);
    return r.map(c => ({
      componentName: c.name,
      totalTimeSpent: c.totalTime,
      numberOfInstances:
        index[c.name].mount.timeSpent.length -
        index[c.name].unmount.timeSpent.length,
      percentTimeSpent: percent(c.totalTime / allComponentsTotalTime),
      render: mapTiming(index[c.name].render.timeSpent),
      mount: mapTiming(index[c.name].mount.timeSpent),
      update: mapTiming(index[c.name].update.timeSpent),
      unmount: mapTiming(index[c.name].unmount.timeSpent)
    }));
    function mapTiming(nums) {
      return {
        averageTimeSpentMs: average(nums),
        numberOfTimes: nums.length,
        totalTimeSpentMs: sum(nums)
      };
    }
  }
  const containerStyle = {
    fontFamily: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
    zIndex: 999,
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: "white",
    overflowY: "auto",
    fontSize: 12,
    height: "100%"
  };
  class PerfProvider extends React.Component {
    constructor(props) {
      super(props);
      this.flush = () => {
        chrome.devtools.inspectedWindow.eval(
          "JSON.stringify(performance.getEntriesByType('measure'))",
          function(result, exception) {
            if (exception) {
              console.error("exception", exception);
              return;
            }
            innerFlush(JSON.parse(result));
          }
        );
        const innerFlush = result => {
          previousMeasures = previousMeasures.concat(result);
          const data = mapData(readReactPerformanceData(previousMeasures));
          this.setState({
            data,
            totalTime: data.reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
          });
          chrome.devtools.inspectedWindow.eval(
            "JSON.stringify(performance.clearMeasures())"
          );
        };
      };
      this.clear = () => {
        previousMeasures = [];
        this.setState({
          data: mapData(readReactPerformanceData(previousMeasures)),
          totalTime: 0
        });
        chrome.devtools.inspectedWindow.eval(
          "JSON.stringify(performance.clearMeasures())"
        );
      };
      this.reload = () => {
        this.clear();
        chrome.devtools.inspectedWindow.reload();
      };
      this.state = {
        data: [],
        totalTime: 0,
        pendingEventCount: 0
      };
    }
    componentDidMount() {
      setInterval(() => {
        chrome.devtools.inspectedWindow.eval(
          "performance.getEntriesByType('measure').length",
          function(result, exception) {
            if (exception) {
              console.error("exception", exception);
              return;
            }
            innerEvents(JSON.parse(result));
          }
        );
      }, 2000);
      const innerEvents = eventCount => {
        this.setState({
          pendingEventCount: eventCount
        });
        if (this.state.data.length === 0) {
          this.flush();
        }
      };
    }
    render() {
      const toolbarStyle = {
        border: "1px solid #dadada",
        paddingTop: 2,
        paddingBottom: 2
      };
      const toolbarDividerStyle = {
        backgroundColor: "#ccc",
        width: 1,
        margin: "0 4px",
        height: 12,
        display: "inline-block"
      };
      const buttonStyle = {
        backgroundColor: "#3B78E7",
        color: "white",
        padding: "1px 12px",
        border: "1px solid rgba(0, 0, 0, 0.14)"
      };
      return React.createElement(
        "div",
        null,
        this.props.children,
        React.createElement(
          "div",
          { style: Object.assign({}, containerStyle) },
          React.createElement(
            "div",
            { style: toolbarStyle },
            React.createElement("span", null, "React Perf Panel"),
            React.createElement("div", { style: toolbarDividerStyle }),
            React.createElement(
              "button",
              { style: buttonStyle, onClick: this.flush },
              "Update"
            ),
            React.createElement("div", { style: toolbarDividerStyle }),
            React.createElement(
              "span",
              null,
              this.state.pendingEventCount,
              " pending events"
            ),
            React.createElement("div", { style: toolbarDividerStyle }),
            React.createElement(
              "button",
              { style: buttonStyle, onClick: this.clear },
              "Clear"
            ),
            React.createElement("div", { style: toolbarDividerStyle }),
            React.createElement(
              "button",
              { style: buttonStyle, onClick: this.reload },
              "Reload Inspected Page"
            )
          ),
          React.createElement(PerfTable, { components: this.state.data }),
          React.createElement(
            "div",
            {
              style: Object.assign({}, toolbarStyle, {
                position: "sticky",
                width: "100%",
                bottom: 0,
                background: "#EEE",
                paddingLeft: 10,
                fontWeight: "bold"
              })
            },
            React.createElement(
              "span",
              null,
              "Total time: ",
              this.state.totalTime,
              "ms"
            )
          )
        )
      );
    }
  }
  exports.PerfProvider = PerfProvider;
  const PerfTable = props =>
    React.createElement(
      "div",
      {
        style: {
          minWidth: "100%",
          display: "inline-block"
        }
      },
      React.createElement(TableHeader, null),
      " ",
      props.components.map((c, i) =>
        React.createElement(ComponentView, {
          perf: c,
          key: c.componentName,
          alternateRow: i % 2 === 0
        })
      )
    );
  const width = 70;
  const componentNameWidth = 200;
  const HeaderStyle = {
    width,
    display: "inline-block",
    textAlign: "center",
    fontWeight: "bold",
    whiteSpace: "pre-wrap"
  };
  const ComponentNameStyle = Object.assign({}, HeaderStyle, {
    width: componentNameWidth
  });
  const ComponentTimingStyle = {
    width,
    display: "inline-block",
    textAlign: "center"
  };
  const TableHeader = () =>
    React.createElement(
      "div",
      {
        style: {
          flexDirection: "row",
          borderBottom: "1px solid #e1e1e1",
          display: "inline-block",
          whiteSpace: "nowrap"
        }
      },
      React.createElement(
        "span",
        { style: ComponentNameStyle },
        "Component Name"
      ),
      React.createElement("span", { style: HeaderStyle }, "Total time (ms)"),
      React.createElement("span", { style: HeaderStyle }, "% of time"),
      React.createElement(MetricHeader, { name: "Mount" }),
      React.createElement(MetricHeader, { name: "Update" }),
      React.createElement(MetricHeader, { name: "Unmount" }),
      React.createElement(MetricHeader, { name: "render" })
    );
  const MetricHeader = ({ name }) =>
    React.createElement(
      "span",
      {
        style: {
          border: "1px solid #3B78E7"
        }
      },
      React.createElement(
        "span",
        { style: Object.assign({}, HeaderStyle, { position: "relative" }) },
        "Count",
        React.createElement(
          "span",
          {
            style: {
              position: "absolute",
              left: width - 5,
              fontWeight: "normal"
            }
          },
          "\u2715"
        )
      ),
      React.createElement(
        "span",
        { style: HeaderStyle },
        React.createElement(
          "span",
          {
            style: {
              display: "block"
            }
          },
          name
        ),
        React.createElement(
          "span",
          {
            style: {
              display: "block",
              position: "relative"
            }
          },
          "Ms per",
          React.createElement(
            "span",
            {
              style: {
                position: "absolute",
                left: width - 5,
                fontWeight: "normal"
              }
            },
            "="
          )
        )
      ),
      React.createElement("span", { style: HeaderStyle }, "Total ms")
    );
  const ComponentView = props =>
    React.createElement(
      "div",
      {
        style: props.alternateRow
          ? {
              background: "#EEE"
            }
          : {}
      },
      React.createElement(
        "span",
        {
          style: Object.assign({}, ComponentNameStyle, {
            width: componentNameWidth - 10,
            paddingLeft: 10,
            fontWeight: "normal",
            textAlign: "left"
          })
        },
        props.perf.componentName
      ),
      React.createElement(
        "span",
        { style: ComponentTimingStyle },
        props.perf.totalTimeSpent
      ),
      React.createElement(
        "span",
        { style: ComponentTimingStyle },
        props.perf.percentTimeSpent
      ),
      React.createElement(ComponentTimingView, {
        name: "mount",
        timing: props.perf.mount
      }),
      React.createElement(ComponentTimingView, {
        name: "update",
        timing: props.perf.update
      }),
      React.createElement(ComponentTimingView, {
        name: "unmount",
        timing: props.perf.unmount
      }),
      React.createElement(ComponentTimingView, {
        name: "render",
        timing: props.perf.render
      })
    );
  const ComponentTimingView = props =>
    React.createElement(
      "span",
      null,
      React.createElement(
        "span",
        { style: ComponentTimingStyle },
        props.timing.numberOfTimes
      ),
      React.createElement(
        "span",
        { style: ComponentTimingStyle },
        props.timing.averageTimeSpentMs
      ),
      React.createElement(
        "span",
        { style: ComponentTimingStyle },
        props.timing.totalTimeSpentMs
      )
    );
});
