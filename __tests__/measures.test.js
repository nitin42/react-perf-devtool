function getComponentAndPhaseName(measure) {
  if (measure.name.includes('⚛')) {
    const index = measure.name.split('⚛ ').join('')

    // Get component name and phase name (mount, update, render, unmount)
    // Eg - "App [mount]"
    if ((/\[\w+\]/).test(index)) {
      const [componentName, phase] = index.split(' ')
      return {
        componentName,
        phase,
      }
    } else if ((/\w+\.\w+/).test(index)) { // Get component name and lifecycle hook. Eg - App.componentWillMount
      const [componentName, lifecycle] = index.split('.')
      return {
        componentName,
        phase: lifecycle,
      }
    }
  } else if (measure.name.includes('⛔')) { // If lifecycle hook has scheduled a cascading update
    const index = measure.name.split('⛔ ').join('')

    if ((/\w+\.\w+/).test(index)) {
      const [componentName, lifecycle] = index.split('.')
      return {
        componentName,
        phase: lifecycle.split(' Warning:')[0],
      }
    } else {
      return {
        componentName: null,
        phase: null,
      }
    }
  }

  return {
    componentName: null,
    phase: null,
  }
}

describe('Measure names', () => {
  test('Component name and phase name', () => {
    console.log(getComponentAndPhaseName({
      name: '⚛ App [mount]'
    }))
    expect(
      getComponentAndPhaseName({
        name: '⚛ App [mount]'
      })
    ).toEqual({ componentName: 'App', phase: '[mount]'})
  })

  test('Component name and lifecycle hook without warning for cascading updates', () => {
    console.log(getComponentAndPhaseName({
      name: '⚛ App.componentWillMount'
    }));
    expect(
      getComponentAndPhaseName({
        name: '⚛ App.componentWillMount'
      })
    ).toEqual({ componentName: 'App', phase: 'componentWillMount' })
  })

  test('Component name and lifecycle hook with warning for cascading updates', () => {
    console.log(getComponentAndPhaseName({
      name: '⛔ App.componentWillMount Warning: Scheduled a cascading update',
    }));
    expect(
      getComponentAndPhaseName({
        name: '⛔ App.componentWillMount Warning: Scheduled a cascading update',
      })
    ).toEqual({ componentName: 'App', phase: 'componentWillMount' })
  })
})
