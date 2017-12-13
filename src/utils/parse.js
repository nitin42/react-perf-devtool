// This function parses the React performance data and returns a store object
// which contains the time spent during the mount, unmount, render and updating of a React component.

function parseReactPerformanceData(measures) {
  // Stores the mount, unmount, render and update time of a React component
  const store = {}

  for (const measure in measures) {
    const [componentName, stage] = measure.name.split(" ")

    // Create a new component property
    if (!store[componentName]) {
      store[componentName] = {
        mount: { time: [] },
        unmount: { time: [] },
        render: { time: [] },
        update: { time: [] }
      }
    }

    // Update the time duration

    if (stage === "[mount]") {
      store[componentName].mount.time.push(measure.duration)
    }

    if (stage === "[unmount]") {
      store[componentName].unmount.time.push(measure.duration)
    }

    if (stage === "[render]") {
      store[componentName].render.time.push(measure.duration)
    }

    if (stage === "[update]") {
      store[componentName].update.time.push(measure.duration)
    }
  }

  return store
}

module.exports = parseReactPerformanceData
