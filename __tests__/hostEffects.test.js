var MEASURES = require('../samples/measures')

var {
  getCommitHostEffectsTime,
  getTotalEffects
} = require('../src/shared/hostEffects')
var { getTotalTime } = require('../src/shared/totalTime')

describe('Committing Host Effects', () => {
  test('Sanity', () => {
    expect(getCommitHostEffectsTime(MEASURES)).toMatchSnapshot()
  })

  test('Total time taken in committing host effects', () => {
    expect(getTotalTime(getCommitHostEffectsTime(MEASURES))).toMatchSnapshot()
  })

  test('Total effects', () => {
    expect(
      getTotalEffects(getCommitHostEffectsTime(MEASURES))
    ).toMatchSnapshot()
  })
})
