var getComponentAndPhaseName = require('../src/shared/parseMeasures')

describe('Measure names', () => {
  test('Component name and phase name', () => {
    console.log(
      getComponentAndPhaseName({
        name: '⚛ App [mount]'
      })
    )
    expect(
      getComponentAndPhaseName({
        name: '⚛ App [mount]'
      })
    ).toEqual({ componentName: 'App', phase: '[mount]' })
  })

  test('Component name and lifecycle hook without warning for cascading updates', () => {
    console.log(
      getComponentAndPhaseName({
        name: '⚛ App.componentWillMount'
      })
    )
    expect(
      getComponentAndPhaseName({
        name: '⚛ App.componentWillMount'
      })
    ).toEqual({ componentName: 'App', phase: 'componentWillMount' })
  })

  test('Component name and lifecycle hook with warning for cascading updates', () => {
    console.log(
      getComponentAndPhaseName({
        name: '⛔ App.componentDidMount Warning: Scheduled a cascading update'
      })
    )
    expect(
      getComponentAndPhaseName({
        name: '⛔ App.componentDidMount Warning: Scheduled a cascading update'
      })
    ).toEqual({ componentName: 'App', phase: 'componentDidMount' })
  })
})
