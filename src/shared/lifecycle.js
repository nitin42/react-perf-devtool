import { add } from './math'

const CALLING_LIFECYCLE_METHODS = 'Calling Lifecycle Methods'
const getLifecycleTime = measures => {
  const measurementsByName = measures.filter(
    measure =>
      measure.name.includes('⚛') &&
      measure.name
        .split('⚛ ')
        .join('')
        .includes(CALLING_LIFECYCLE_METHODS)
  )
  return {
    [CALLING_LIFECYCLE_METHODS]: {
      totalMethods: measurementsByName.map(measurementByName => {
        const methodValue = measurementByName.name.split(':')[1].split(' ')[1]
        return Number(methodValue)
      }),
      timeSpent: measurementsByName.map(measurementByName =>
        Number(measurementByName.duration.toFixed(2))
      )
    }
  }
}
const getTotalMethods = store =>
  Number(add(store[CALLING_LIFECYCLE_METHODS].totalMethods))

export { getTotalMethods, getLifecycleTime }
