const React = require('../../extension/third_party/react')

const width = 70;

const HeaderStyle = {
  width,
  display: "inline-block",
  textAlign: "center",
  fontWeight: "bold",
  whiteSpace: "pre-wrap"
};

class MetricHeader extends React.Component {
  render() {
    return (
      <span
        style={{
          border: "1px solid #3B78E7"
        }}
      >
        <span
          style={{
            ...HeaderStyle,
            position: "relative"
          }}
        >
          Count
          <span
            style={{
              position: "absolute",
              left: width - 5,
              fontWeight: "normal"
            }}
          >
            ✕
          </span>
        </span>
        <span style={HeaderStyle}>
          <span
            style={{
              display: "block"
            }}
          >
            {this.props.name}
          </span>
          <span
            style={{
              display: "block",
              position: "relative"
            }}
          >
            Ms per
            <span
              style={{
                position: "absolute",
                left: width - 5,
                fontWeight: "normal"
              }}
            >
              =
            </span>
          </span>
        </span>
        <span style={HeaderStyle}>Total ms</span>
      </span>
    )
  }
}

module.exports = MetricHeader;
