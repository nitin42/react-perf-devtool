import React from 'react'

import { ProgressLoader } from './ProgressLoader'

const theme = require('../theme')

/**
  This component renders the data (measures of each component)
*/
export function Measures(props) {
  return (
    <div>
      <h1 className="component-text">Components</h1>
      {props.measures.map((measure, index) => {
        return (
          <div
            key={index}
            id={measure.componentName}
            className="container component-result"
          >
            <h2>{measure.componentName}</h2>
            <table style={theme === 'dark' ? { color: '#eff1f4' } : null}>
              <tr>
                <td>Total time (ms)</td>
                <td>
                  <strong>{Number(measure.totalTimeSpent.toFixed(2))}</strong>
                </td>
              </tr>
              <tr>
                <td>Instances</td>
                <td>
                  <strong>{measure.numberOfInstances}</strong>
                </td>
              </tr>
              <tr>
                <td>Total time (%)</td>
                <td>
                  <strong>{measure.percentTimeSpent}</strong>
                </td>
              </tr>
              <tr>
                <td>Mount (ms)</td>
                <td>
                  <strong>{measure.mount.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>Update (ms)</td>
                <td>
                  <strong>{measure.update.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>Render (ms)</td>
                <td>
                  <strong>{measure.render.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>Unmount (ms)</td>
                <td>
                  <strong>{measure.unmount.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>componentWillMount (ms)</td>
                <td>
                  <strong>{measure.componentWillMount.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>componentDidMount (ms)</td>
                <td>
                  <strong>{measure.componentDidMount.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>componentWillReceiveProps (ms)</td>
                <td>
                  <strong>
                    {measure.componentWillReceiveProps.totalTimeSpentMs}
                  </strong>
                </td>
              </tr>
              <tr>
                <td>shouldComponentUpdate (ms)</td>
                <td>
                  <strong>
                    {measure.shouldComponentUpdate.totalTimeSpentMs}
                  </strong>
                </td>
              </tr>
              <tr>
                <td>componentWillUpdate (ms)</td>
                <td>
                  <strong>
                    {measure.componentWillUpdate.totalTimeSpentMs}
                  </strong>
                </td>
              </tr>
              <tr>
                <td>componentDidUpdate (ms)</td>
                <td>
                  <strong>{measure.componentDidUpdate.totalTimeSpentMs}</strong>
                </td>
              </tr>
              <tr>
                <td>componentWillUnmount (ms)</td>
                <td>
                  <strong>
                    {measure.componentWillUnmount.totalTimeSpentMs}
                  </strong>
                </td>
              </tr>
            </table>
          </div>
        )
      })}
    </div>
  )
}
