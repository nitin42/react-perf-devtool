function add(nums) {
  return Number(nums.reduce((acc, v) => (acc += v), 0).toFixed(2))
}

function average(nums) {
  if (nums.length === 0) {
    return '-'
  }
  return (nums.reduce((acc, v) => (acc += v), 0) / nums.length).toFixed(2)
}

function percent(num) {
  return Math.round(num * 100) + '%'
}

export { add, average, percent }
