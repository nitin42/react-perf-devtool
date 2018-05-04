import React from 'react'

export function Buttons({ theme, clear, reload, update }) {
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
      <button
        className={theme === 'dark' ? 'dark-btn' : 'btn'}
        onClick={update}
      >
        update
      </button>
    </React.Fragment>
  )
}
