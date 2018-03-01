import React from 'react'

export function Buttons({ theme, clear, reload }) {
  return (
    <React.Fragment>
      <button className={theme === 'dark' ? 'dark-btn' : 'btn'} onClick={clear}>
        Clear
      </button>
      <button
        className={theme === 'dark' ? 'dark-btn' : 'btn'}
        onClick={reload}
      >
        Reload
      </button>
    </React.Fragment>
  )
}
