import { add } from './math'

const COMMITTING_CHANGES = 'Committing Changes'
const LIFE_CYCLE_NOTICE = '⚛'
const RECONCILIATION_NOTICE = '⛔'

const getMeasurmentsByDelimiter = (measurments, delimiter) =>
  measurments
    .filter(
      measurment =>
        measurment.name.includes(delimiter) &&
        measurment.name
          .split(delimiter)
          .join('')
          .includes(COMMITTING_CHANGES)
    )
    .map(measurment => Number(measurment.duration.toFixed(2)))

const getCommitChangesTime = measurements => ({
  [COMMITTING_CHANGES]: {
    timeSpent: [
      ...getMeasurmentsByDelimiter(measurements, LIFE_CYCLE_NOTICE),
      ...getMeasurmentsByDelimiter(measurements, RECONCILIATION_NOTICE)
    ]
  }
})

export { getCommitChangesTime }
