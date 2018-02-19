/**
 This function returns the component name and phase name from the measure name (returned from React performance data).
 This may break if React changes the mark name (measure name).
*/
const getComponentAndPhaseName = measure => {
  if (measure.name.includes('⚛')) {
    let index = measure.name.split('⚛ ').join('')

    // "App [mount]"
    if (/\[\w+\]/.test(index)) {
      const [componentName, phase] = index.split(' ')
      return {
        componentName,
        phase
      }
    } else if (/\w+\.\w+/.test(index)) {
      // App.componentWillMount
      const [componentName, lifecycle] = index.split('.')
      return {
        componentName,
        phase: lifecycle
      }
    } else {
      return null
    }
  } else if (measure.name.includes('⛔')) {
    let index = measure.name.split('⛔ ').join('')

    if (/\w+\.\w+/.test(index)) {
      return {
        componentName: index.split('.')[0],
        phase: index.split('.')[1].split(' Warning:')[0]
      }
    } else {
      return null
    }
  }

  return null
}

export { getComponentAndPhaseName }
