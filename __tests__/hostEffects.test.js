const MEASURES = require('../samples/measures')

const { getCommitHostEffectsTime, getTotalEffects } = require('../src/utils/hostEffects')
const getTotalTime = require('../src/utils/totalTime')

describe('Committing Host Effects', () => {
  test('Sanity', () => {
    console.log(getCommitHostEffectsTime(MEASURES))
  })

  test('Total time taken in committing host effects', () => {
    console.log(getTotalTime(getCommitHostEffectsTime(MEASURES)))
  })

  test('Total effects', () => {
    console.log(getTotalEffects(getCommitHostEffectsTime(MEASURES)))
  })
})
