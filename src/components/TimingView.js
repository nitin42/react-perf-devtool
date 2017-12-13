const React = require('../../extension/third_party/react')

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

class TimingView extends React.Component {
  render() {
    return (
      <span>
        <span style={ComponentTimingStyle}>{this.props.timing.numberOfTimes}</span>
        <span style={ComponentTimingStyle}>{this.props.timing.averageTimeSpentMs}</span>
        <span style={ComponentTimingStyle}>{this.props.timing.totalTimeSpentMs}</span>
      </span>
    )
  }
}

module.exports = TimingView;
