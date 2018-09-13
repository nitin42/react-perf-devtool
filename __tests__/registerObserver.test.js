var {
  registerObserver,
  getMeasuresByComponentName
} = require('../src/npm/hook')

describe('`registerObserver`', () => {
  let observer
  let callback
  let params
  let observerReference
  describe('with `window.PerformanceObserver`', () => {
    beforeEach(() => {
      observerReference = {
        observe: jest.fn()
      }
      window.PerformanceObserver = jest.fn(() => observerReference)
      callback = jest.fn()
      observer = registerObserver(params, callback)
    })
    it('should return `observer`', () => {
      expect(observer).toEqual(observerReference)
    })
    it('should call `observer.observe`', () => {
      expect(observerReference.observe).toHaveBeenCalledTimes(1)
    })
    describe('without `params`', () => {
      beforeEach(() => {
        params = undefined
      })
      it('should call `observer.observe` with `entryTypes`', () => {
        expect(observerReference.observe).toHaveBeenCalledWith({
          entryTypes: ['measure']
        })
      })
    })
  })
  describe('without `window.PerformanceObserver`', () => {
    beforeEach(() => {
      window.PerformanceObserver = undefined
      callback = jest.fn()
      params = undefined
      observer = registerObserver(params, callback)
    })
    it('should return `undefined`', () => {
      expect(observer).toEqual(undefined)
    })
  })
})

describe('utils', () => {
  let componentNames
  let measures
  let requiredMeasures
  describe('getMeasuresByComponentName', () => {
    describe('with matching `componentNames`', () => {
      beforeEach(() => {
        componentNames = ['foo']
        measures = [
          {
            componentName: 'foo'
          }
        ]
        requiredMeasures = getMeasuresByComponentName(componentNames, measures)
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
        requiredMeasures = getMeasuresByComponentName(componentNames, measures)
      })
      it('should return a list of empty measure', () => {
        expect(requiredMeasures).toEqual([])
      })
    })
  })
})
