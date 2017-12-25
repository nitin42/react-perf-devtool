var MEASURES = require('../samples/measures')

var getCommitChangesTime = require('../src/shared/commitChanges')
var getTotalTime = require('../src/shared/totalTime')

describe('Committing changes time duration', () => {
  test('Committing changes with and without warning for cascading updates in earlier commits', () => {
    expect(getCommitChangesTime(MEASURES)).toMatchSnapshot()
  })

  console.log(getTotalTime(getCommitChangesTime(MEASURES)))
  test('Returns total time taken in committing changes', () => {
    expect(getTotalTime(getCommitChangesTime(MEASURES))).toMatchSnapshot()
  })
})
