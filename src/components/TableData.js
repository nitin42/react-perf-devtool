const React = require('../../extension/third_party/react')

class TableData extends React.Component {
  renderMeasures = measures => {
    return measures.map((measure, index) => {
      return (
        <tr key={index}>
          <td>{measure.componentName}</td>
          <td>{Number(measure.totalTimeSpent.toFixed(2))}</td>
          <td>{measure.numberOfInstances}</td>
          <td>{measure.percentTimeSpent}</td>
          <td>{measure.mount.totalTimeSpentMs}</td>
          <td>{measure.update.totalTimeSpentMs}</td>
          <td>{measure.render.totalTimeSpentMs}</td>
          <td>{measure.unmount.totalTimeSpentMs}</td>
          <td>{measure.componentWillMount.totalTimeSpentMs}</td>
          <td>{measure.componentDidMount.totalTimeSpentMs}</td>
          <td>{measure.componentWillUpdate.totalTimeSpentMs}</td>
          <td>{measure.componentDidUpdate.totalTimeSpentMs}</td>
          <td>{measure.componentWillReceiveProps.totalTimeSpentMs}</td>
          <td>{measure.componentWillUnmount.totalTimeSpentMs}</td>
          <td>{measure.shouldComponentUpdate.totalTimeSpentMs}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.renderMeasures(this.props.measures)}
      </React.Fragment>
    )
  }
}

module.exports = TableData
