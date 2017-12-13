const React = require('../../extension/third_party/react')

const MetricHeader = require('./MetricHeader');

const width = 70;
const componentNameWidth = 200;

const HeaderStyle = {
  width,
  display: "inline-block",
  textAlign: "center",
  fontWeight: "bold",
  whiteSpace: "pre-wrap"
};

const ComponentNameStyle = {
  ...HeaderStyle,
  width: componentNameWidth
};

const ComponentTimingStyle = {
  width,
  display: "inline-block",
  textAlign: "center"
};

class TableHeader extends React.Component {
  render() {
    return (
      <div
        style={{
          flexDirection: "row",
          borderBottom: "1px solid #e1e1e1",
          display: "inline-block",
          whiteSpace: "nowrap"
        }}
      >
        <span style={ComponentNameStyle}>Component Name</span>
        <span style={HeaderStyle}>Total time (ms)</span>
        <span style={HeaderStyle}>% of time</span>
        <MetricHeader name={"Mount"} />
        <MetricHeader name={"Update"} />
        <MetricHeader name={"Unmount"} />
        <MetricHeader name={"render"} />
        <MetricHeader name={"componentWillMount"} />
        <MetricHeader name={"componentDidMount"} />
        <MetricHeader name={"componentWillReceiveProps"} />
        <MetricHeader name={"shouldComponentUpdate"} />
        <MetricHeader name={"componentWillUpdate"} />
        <MetricHeader name={"componentDidUpdate"} />
        <MetricHeader name={"componentWillUnmount"} />
      </div>
    )
  }
}

module.exports = TableHeader;
