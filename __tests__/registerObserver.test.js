var { registerObserver, getRequiredMeasures } = require('../src/npm/hook')

describe('Register Observer', () => {
  describe('The register observer function shouldnt crash', () => {
    beforeEach(() => {
      window.PerformanceObserver = jest.fn(callback => ({
        observe: () =>
          callback({
            getEntries: () => []
          })
      }))
    })
    test('Call register without params', () => {
      expect(registerObserver()).toBeUndefined()
      expect(window.PerformanceObserver).toHaveBeenCalled()
    })
    test('Call register with params', () => {
      const callback = () => {}
      expect(
        registerObserver({ shouldLog: true, port: 8080 }, callback)
      ).toBeUndefined()
      expect(window.PerformanceObserver).toHaveBeenCalled()
    })
    test('Call register with params but without callback', () => {
      expect(registerObserver({ shouldLog: true, port: 8080 })).toBeUndefined()
      expect(window.PerformanceObserver).toHaveBeenCalled()
    })
    test('Call register without params but without callback', () => {
      const callback = () => {}
      expect(registerObserver(undefined, callback)).toBeUndefined()
      expect(window.PerformanceObserver).toHaveBeenCalled()
    })
  })
})

describe('utils', () => {
  let componentNames
  let measures
  let requiredMeasures
  describe('getRequiredMeasures', () => {
    describe('with matching `componentNames`', () => {
      beforeEach(() => {
        componentNames = ['foo']
        measures = [
          {
            componentName: 'foo'
          }
        ]
        requiredMeasures = getRequiredMeasures(componentNames, measures)
      })
      it('should return a list of required measure', () => {
        expect(requiredMeasures).toEqual([
          {
            componentName: 'foo'
          }
        ])
      })
    })
    describe('without matching `componentNames`', () => {
      beforeEach(() => {
        componentNames = ['foo']
        measures = [
          {
            componentName: 'bar'
          }
        ]
        requiredMeasures = getRequiredMeasures(componentNames, measures)
      })
      it('should return a list of empty measure', () => {
        expect(requiredMeasures).toEqual([])
      })
    })
  })
})
