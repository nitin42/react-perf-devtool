import { add } from './math'

const COMMITTING_HOST_EFFECTS = 'Committing Host Effects'

// Update the store with the time spent while committing host effects
const getCommitHostEffectsTime = measures => {
  const measurementsByMatchingName = measures.filter(
    measure =>
      measure.name.includes('⚛') &&
      measure.name
        .split('⚛ ')
        .join('')
        .includes(COMMITTING_HOST_EFFECTS)
  )

  return {
    [COMMITTING_HOST_EFFECTS]: {
      totalEffects: measurementsByMatchingName.map(
        measurementByMatchingName => {
          const measurementName = measurementByMatchingName.name
            .split('⚛ ')
            .join('')
          const effectValue = measurementName.split(':')[1].split(' ')[1]
          return Number(effectValue)
        }
      ),
      timeSpent: measurementsByMatchingName.map(measurementByMatchingName => {
        const durationValue = measurementByMatchingName.duration.toFixed(2)
        return Number(durationValue)
      })
    }
  }
}

// Get total number of host effects
const getTotalEffects = store =>
  Number(add(store[COMMITTING_HOST_EFFECTS].totalEffects))

export { getTotalEffects, getCommitHostEffectsTime }
