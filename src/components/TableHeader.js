const React = require('../../extension/third_party/react')

let HEADERS = [
  {
    name: 'Components',
    popup: 'Name of your React component',
  },
  {
    name: 'Total time (ms)',
    popup: 'Total time taken combining all the phases (ms)',
  },
  {
    name: 'Count',
    popup: 'Component instances',
  },
  {
    name: 'Total time (%)',
    popup: 'Total time taken combining all the phases (%)',
  },
  {
    name: 'Mount (ms)',
    popup: 'Component mount time',
  },
  {
    name: 'Update (ms)',
    popup: 'Component update time',
  },
  {
    name: 'Render (ms)',
    popup: 'Component render time',
  },
  {
    name: 'Unmount (ms)',
    popup: 'Component unmount time',
  },
  {
    name: 'componentWillMount',
  },
  {
    name: 'componentDidMount',
  },
  {
    name: 'componentWillUpdate',
  },
  {
    name: 'componentDidUpdate',
  },
  {
    name: 'componentWillReceiveProps',
  },
  {
    name: 'componentWillUnmount',
  },
  {
    name: 'shouldComponentUpdate',
  },
]

class TableHeader extends React.Component {
  renderHeaders = () => {
    return HEADERS.map((header, index) => {
      return (
        <th key={index}>
          {header.name}
          {header.popup !== undefined ? (
            <div className="tooltiptext">{header.popup}</div>
          ) : null}
        </th>
      )
    })
  }

  render() {
    return <tr>{this.renderHeaders()}</tr>
  }
}

module.exports = TableHeader
