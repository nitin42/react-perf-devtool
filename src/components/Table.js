const React = require('react')

const TableHeader = require('./TableHeader')
const TableData = require('./TableData')

/**
 This component renders the table that contains the performance measures of React components.
*/
function Table(props) {
  return (
    <table id="measures">
      <TableHeader />
      <TableData measures={props.measures} />
    </table>
  )
}

module.exports = Table
