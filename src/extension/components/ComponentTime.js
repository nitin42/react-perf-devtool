var React = require('react')
var ProgressLoader = require('./ProgressLoader')

function ComponentTime(props) {
  const calign = {
    margin: '0',
    paddingLeft: '10',
    paddingRight: '10',
    paddingTop: '10',
    textAlign: 'center',
    cursor: 'pointer'
  }
  const hrefStyle = {
    textDecoration: 'none',
    color: 'black'
  }
  return (
    <div style={calign}>
      <a style={hrefStyle} href={`#${props.componentname}`}>
        <ProgressLoader
          strokeWidth="2"
          sqSize="50"
          percentage={props.percentage}
        />
        <p>
          {props.componentname} - {props.msec} ms
        </p>
      </a>
    </div>
  )
}

module.exports = ComponentTime
