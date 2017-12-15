const React = require('../../extension/dependencies/react')

const TableHeader = require('./TableHeader')
const TableData = require('./TableData')

/**
 This component renders the table that contains the performance measures of React components.
*/
function Table(props) {
  return (
    <table id="measures">
      <TableHeader />
      {/* Use context here instead of passing props from Parent*/}
      <TableData measures={props.perfData} />
    </table>
  )
}

module.exports = Table
