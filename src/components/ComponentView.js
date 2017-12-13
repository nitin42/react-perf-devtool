const React = require('../../extension/third_party/react')
const ComponentTimingView = require('./TimingView');

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

class ComponentView extends React.Component {
  render() {
    return (
      <div
        style={
          this.props.alternateRow
            ? {
                background: "#EEE"
              }
            : {}
        }
      >
        <span
          style={{
            ...ComponentNameStyle,
            width: componentNameWidth - 10,
            paddingLeft: 10,
            fontWeight: "normal",
            textAlign: "left",
          }}
        >
          {this.props.perf.componentName}
        </span>
        <span style={ComponentTimingStyle}>{this.props.perf.totalTimeSpent}</span>
        <span style={ComponentTimingStyle}>{this.props.perf.percentTimeSpent}</span>
        <ComponentTimingView
          name={"mount"}
          timing={this.props.perf.mount}
        />
        <ComponentTimingView
          name={"update"}
          timing={this.props.perf.update}
        />
        <ComponentTimingView
          name={"unmount"}
          timing={this.props.perf.unmount}
        />
        <ComponentTimingView
          name={"render"}
          timing={this.props.perf.render}
        />
        <ComponentTimingView
          name={"componentWillMount"}
          timing={this.props.perf.componentWillMount}
        />
        <ComponentTimingView
          name={"componentDidMount"}
          timing={this.props.perf.componentDidMount}
        />
        <ComponentTimingView
          name={"componentWillReceiveProps"}
          timing={this.props.perf.componentWillReceiveProps}
        />
        <ComponentTimingView
          name={"shouldComponentUpdate"}
          timing={this.props.perf.shouldComponentUpdate}
        />
        <ComponentTimingView
          name={"componentWillUpdate"}
          timing={this.props.perf.componentWillUpdate}
        />
        <ComponentTimingView
          name={"componentDidUpdate"}
          timing={this.props.perf.componentDidUpdate}
        />
        <ComponentTimingView
          name={"componentWillUnmount"}
          timing={this.props.perf.componentWillUnmount}
        />
      </div>
    )
  }
}

module.exports = ComponentView
