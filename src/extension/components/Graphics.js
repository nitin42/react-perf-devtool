import React from 'react'

export function Graphics(props) {
  return (
    <React.Fragment>
      <p>Overall time taken</p>
      <canvas id="myChart" width="400" height="300" />
      <p>
        {' '}
        Total time taken combining all the phases -{' '}
        <strong>{props.totalTime} ms</strong>{' '}
      </p>
    </React.Fragment>
  )
}
