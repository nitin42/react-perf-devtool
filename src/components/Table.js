const React = require('../../extension/third_party/react')

const TableHeader = require('./TableHeader')
const TableData = require('./TableData')

class Table extends React.Component {
  render() {
    return (
      <table id="measures">
        <TableHeader />
        {/* Use context here instead of passing props from Parent*/}
        <TableData measures={this.props.perfData} />
      </table>
    )
  }
}

module.exports = Table
