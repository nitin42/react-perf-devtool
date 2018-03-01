import React from 'react'

export function ErrorComponent() {
  return (
    <div style={{ fontWeight: 500, padding: '8px' }}>
      An error occurred while collecting the measures. This is possibly due to
      <ul>
        <li>
          absence of register observer hook in your project.{' '}
          <a
            href="https://github.com/nitin42/react-perf-devtool/tree/v2#using-the-browser-extension"
            style={{ textDecoration: 'none' }}
            target="_blank"
          >
            See the detailed documentation
          </a>{' '}
          on how to register a top level observer in your React application.
        </li>
        <br />
        <li>your project is not using React.</li>
      </ul>
      <p>
        If above solutions don't work, then try reloading the plugin or close
        and reopen the inspected window.
      </p>
    </div>
  )
}
