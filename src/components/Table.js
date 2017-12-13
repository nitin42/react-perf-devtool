const React = require('../../extension/third_party/react')

const TableHeader = require('./TableHeader');
const ComponentView = require('./ComponentView');

class Table extends React.Component {
  render() {
    return (
      <div
        style={{
          minWidth: "100%",
          display: "inline-block"
        }}
      >
        <TableHeader />
        {" "}
        {this.props.components.map((c, i) =>
          <ComponentView
            perf={c}
            key={c.componentName}
            alternateRow={i % 2 === 0}
          />
        )}
      </div>
    )
  }
}

module.exports = Table
