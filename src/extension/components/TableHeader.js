var React = require('react')

// NOTE: The order is important. Don't change it!
var HEADERS = [
  // Component list
  'Components',
  // Total time
  'Total time (ms)',
  // Instances
  'Count',
  // Percentage time
  'Total time (%)',
  // Phases
  'Mount (ms)',
  'Update (ms)',
  'Render (ms)',
  'Unmount (ms)',
  // Lifecycle hooks
  'componentWillMount (ms)',
  'componentDidMount (ms)',
  'componentWillReceiveProps (ms)',
  'shouldComponentUpdate (ms)',
  'componentWillUpdate (ms)',
  'componentDidUpdate (ms)',
  'componentWillUnmount (ms)'
]

/**
  This component renders the table headers (and popups for some phases!)
*/
function TableHeader() {
  return (
    <tr>
      {HEADERS.map((header, index) => {
        return <th key={index}>{header}</th>
      })}
    </tr>
  )
}

module.exports = TableHeader
