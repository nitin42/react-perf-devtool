var React = require('react')

function ErrorComponent() {
  return (
    <div style={{ fontWeight: 500, padding: '8px' }}>
      An error occurred while collecting the measures. To resolve this error,
      try these solutions:
      <ul>
        <li>
          Register a top level observer in your <b>index.js</b> file.{' '}
          <a href="#" style={{ textDecoration: 'none' }}>
            See the detailed documentation
          </a>{' '}
          on how to register a top level listener in your React app.
        </li>
        <br />
        <li>
          Refresh the the page or reload the inspected window if you've
          registered the observer. This may be due to a bug in{' '}
          <b>react-perf-devtool</b>.
        </li>
      </ul>
    </div>
  )
}

module.exports = ErrorComponent
