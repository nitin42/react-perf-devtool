var React = require('react')

var HEADERS = [
  {
    name: 'Components',
    popup: 'Name of your React component'
  },
  {
    name: 'Total time (ms)',
    popup: 'Total time taken combining all the phases (ms)'
  },
  {
    name: 'Count',
    popup: 'Component instances'
  },
  {
    name: 'Total time (%)',
    popup: 'Total time taken combining all the phases (%)'
  },
  {
    name: 'Mount (ms)',
    popup: 'Component mount time'
  },
  {
    name: 'Update (ms)',
    popup: 'Component update time'
  },
  {
    name: 'Render (ms)',
    popup: 'Component render time'
  },
  {
    name: 'Unmount (ms)',
    popup: 'Component unmount time'
  },
  {
    name: 'componentWillMount'
  },
  {
    name: 'componentDidMount'
  },
  {
    name: 'componentWillReceiveProps'
  },
  {
    name: 'shouldComponentUpdate'
  },
  {
    name: 'componentWillUpdate'
  },
  {
    name: 'componentDidUpdate'
  },
  {
    name: 'componentWillUnmount'
  }
]

/**
  This component renders the table headers (and popups for some phases!)
*/
function TableHeader() {
  return (
    <tr>
      {HEADERS.map((header, index) => {
        return (
          <th key={index}>
            {header.name}
            {header.popup !== undefined ? (
              <div className="popup">{header.popup}</div>
            ) : null}
          </th>
        )
      })}
    </tr>
  )
}

module.exports = TableHeader
