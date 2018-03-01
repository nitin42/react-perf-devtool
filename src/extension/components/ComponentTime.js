import React from 'react'

import { ProgressLoader } from './ProgressLoader'

const theme = require('../theme')

// Align the overview pane
const calign = {
  margin: '0',
  paddingLeft: '10',
  paddingRight: '10',
  paddingTop: '10',
  textAlign: 'center',
  cursor: 'pointer',
  fontFamily: 'Metrophobic, Georgia, Serif',
  fontSize: '13px'
}

// Style links for components
const setHrefStyles = theme =>
  theme === 'dark'
    ? { textDecoration: 'none', color: '#eff1f4' }
    : { textDecoration: 'none', color: 'black' }

export function ComponentTime(props) {
  return (
    <div style={calign}>
      <a style={setHrefStyles(theme)} href={`#${props.componentname}`}>
        <ProgressLoader
          strokeWidth="2"
          sqSize="50"
          percentage={props.percentage}
          theme={props.theme}
        />
        <p>{props.componentname}</p>
      </a>
    </div>
  )
}
