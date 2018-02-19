import React from 'react'

const theme = require('../theme')

// inspired from https://codepen.io/bbrady/pen/ozrjKE

export function ProgressLoader(props) {
  // Size of the enclosing square
  const sqSize = props.sqSize
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (props.sqSize - props.strokeWidth) / 2
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`

  const strokeWidth = props.strokeWidth
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - dashArray * props.percentage / 100

  const percentage = props.percentage

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className={
          theme === 'dark' ? 'circle-black-background' : 'circle-background'
        }
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className={
          theme === 'dark' ? 'circle-black-progress' : 'circle-progress'
        }
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset
        }}
      />
      <text
        className={theme === 'dark' ? 'circle-black-text' : 'circle-text'}
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
      >
        {`${percentage} %`}
      </text>
    </svg>
  )
}
