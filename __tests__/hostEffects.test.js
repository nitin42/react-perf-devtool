var MEASURES = require('../samples/measures')

var {
  getCommitHostEffectsTime,
  getTotalEffects
} = require('../src/shared/hostEffects')
var getTotalTime = require('../src/shared/totalTime')

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
