import React from 'react'
import { Graphics } from './Graphics'

export function Stats({ showChart, totalTime }) {
  return (
    <div className="container result">
      <h1 className="results">Stats</h1>
      {showChart ? <Graphics totalTime={totalTime} /> : null}
    </div>
  )
}
