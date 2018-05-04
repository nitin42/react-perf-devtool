import React from 'react'

export function Graphics(props) {
  return (
    <React.Fragment>
      <p>Overall time taken</p>
      <div style={{ height: '50vh', width: '100vw', position: 'relative' }}>
        <canvas id="myChart" />
      </div>
      <p style={{ marginTop: '60vh' }}>
        {' '}
        Total time taken combining all the phases -{' '}
        <strong>{props.totalTime} ms</strong>{' '}
      </p>
    </React.Fragment>
  )
}
