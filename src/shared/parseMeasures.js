/**
 This function returns the component name and phase name from the measure name (returned from React performance data).
 This may break if React changes the mark name (measure name).
*/
let name = null

function getName(measure) {
  if (measure.name.includes('⚛')) {
    let index = measure.name.split('⚛ ').join('')
    if (/\[\w+\]/.test(index)) {
      return index.split(' ')[0]
    } else if (/\w+\)?\.\w+/.test(index)) {
      // App.componentWillMount
      return index.split('.')[0]
    }
  }

  if (measure.name.includes('⛔')) {
    let index = measure.name.split('⛔ ').join('')

    if (/\w+\)?\.\w+/.test(index)) {
      return index.split('.')[0]
    }
  }

  return null
}
const getComponentAndPhaseName = measure => {
  if (measure.name.indexOf('cascading update') > -1) {
    const componentName = getName(measure)

    if (name || componentName) {
      return {
        componentName: componentName || name,
        phase: 'cascadingUpdate'
      }
    }
    return null
  }
  if (measure.name.includes('⚛')) {
    let index = measure.name.split('⚛ ').join('')

    // "App [mount]"
    if (/\[\w+\]/.test(index)) {
      const [componentName, phase] = index.split(' ')
      name = componentName
      return {
        componentName,
        phase
      }
    } else if (/\w+\)?\.\w+/.test(index)) {
      // App.componentWillMount
      const [componentName, phase] = index.split('.')
      name = componentName
      return {
        componentName,
        phase
      }
    }
  } else if (measure.name.includes('⛔')) {
    let index = measure.name.split('⛔ ').join('')

    if (/\w+\)?\.\w+/.test(index)) {
      name = index.split('.')[0]
      return {
        componentName: name,
        phase: index.split('.')[1].split(' Warning:')[0]
      }
    }
  }
  return null
}

export { getComponentAndPhaseName }
