const React = require("react");

const getReactPerformanceData = require("../utils/parse");
const generateDataFromMeasures = require("../utils/generate");

const Table = require("./Table");
const Results = require("./Results");

let store = [];

/**
  This is the main component that renders the table, containing information about
  the component mount/render/update/unmount time and also lifecycle time.
  It also renders the total time taken while committing the changes, host effects
  and calling all the lifecycle methods.
*/
class ReactPerfDevtool extends React.Component {
  timer = null;

  constructor(props) {
    super(props);
    this.state = {
      // Contains the React performance data. This value flows indirectly to TableData component instead of relying on context.
      perfData: [],
      totalTime: 0, // Total time taken combining all the phases.
      pendingEvents: 0, // Pending event count.
      rawMeasures: [], // Raw measures output. It is used for rendering the overall results.
      loading: false // To show the loading output while collecting the results.
    };
  }

  componentDidMount() {
    // We are collecting the results,
    this.setState({ loading: true });

    // Set the timer, and get the total measures and flush them if the store is empty.
    this.timer = setInterval(() => this.getMeasuresLength(), 2000);
  }

  componentWillUnmount() {
    // Clear the timer.
    clearInterval(this.timer);
  }

  getMeasuresLength = () => {
    chrome.devtools.inspectedWindow.eval(
      "performance.getEntriesByType('measure').length",
      (count, error) => {
        if (error) {
          console.error("Error", error);
          return;
        }

        // Update the event count.
        this.updateEventsCount(JSON.parse(count));
      }
    );
  };

  updateEventsCount = count => {
    this.setState({
      pendingEvents: count,
      loading: false
    });

    // Render the measures if the store is empty.
    this.shouldRenderMeasures();
  };

  shouldRenderMeasures = () => {
    if (this.state.perfData.length === 0) {
      // Get the performance measures.
      this.getMeasures();
    }
  };

  getMeasures = () => {
    chrome.devtools.inspectedWindow.eval(
      "JSON.stringify(performance.getEntriesByType('measure'))",
      (measures, error) => {
        if (error) {
          console.error("Error", error);
          return;
        }
        // Update the state.
        this.updateMeasures(JSON.parse(measures));
      }
    );
  };

  updateMeasures = measures => {
    store = store.concat(measures);

    // Parse the performance data.
    const data = generateDataFromMeasures(getReactPerformanceData(store));

    this.setState({
      perfData: data,
      totalTime: data
        .reduce((acc, comp) => acc + comp.totalTimeSpent, 0)
        .toFixed(2),
      rawMeasures: store
    });

    this.clearMeasures();
  };

  // Clear the measures.
  clearMeasures = () =>
    chrome.devtools.inspectedWindow.eval(
      "JSON.stringify(performance.clearMeasures())"
    );

  // Clear the panel content.
  clear = () => {
    store = [];

    this.setState({
      perfData: generateDataFromMeasures(getReactPerformanceData(store)),
      totalTime: 0
    });

    this.clearMeasures();
  };

  // Reload.
  reload = () => {
    this.clear();

    this.setState({ loading: true });

    window !== undefined ? window.location.reload() : null;

    chrome.devtools.inspectedWindow.reload();
  };

  render() {
    console.log(chrome.devtools);
    return (
      <div
        style={{
          color: chrome.devtools.panels.themeName === "dark" ? "white" : "black"
        }}
      >
        <div style={{ display: "inlineBlock" }}>
          <button onClick={this.clear}>Clear</button>
          <button onClick={this.reload}>Reload the inspected page</button>
        </div>

        <div style={{ fontWeight: 500, padding: "8px" }}>
          Pending Events: {this.state.pendingEvents}
        </div>
        <Table measures={this.state.perfData} />
        <Results
          rawMeasures={this.state.rawMeasures}
          totalTime={this.state.totalTime}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

module.exports = ReactPerfDevtool;
