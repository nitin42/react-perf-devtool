function add(numbers) {
  return Math.round(
    Number(numbers.reduce((acc, number) => (acc += number), 0).toFixed(2))
  );
}

function average(numbers) {
  if (numbers.length === 0) {
    return "-";
  }

  return (
    numbers.reduce((acc, number) => (acc += number), 0) / numbers.length
  ).toFixed(1);
}

function percentage(number) {
  return Math.round(number * 100) + "%";
}

// Sort the components in accordance with the total time spent in each phase
function sortComponents(components) {
  return components.sort((a, b) => b.totalTime - a.totalTime);
}

function calPerfTime(timeSpent) {
  return {
    averageTimeSpentMs: average(timeSpent),
    numberOfTimes: timeSpent.length,
    totalTimeSpentMs: add(timeSpent)
  };
}

// This function takes a store object and generates the data about a
// component like total time spent in each phase, name of the component, render time,
// update time, mount time, unmount time, number of instances created of a component

function generateComponentData(store) {
  // Stores the total time taken in each stage by component
  const totalTime = {};

  for (let component in store) {
    // Default
    totalTime[component] = totalTime[component] || 0;

    // Time spent when the component mounts
    totalTime[component] += add(store[component].mount.time);

    // Time spent when the component unmounts
    totalTime[component] += add(store[component].unmount.time);

    // Time spent when the component update
    totalTime[component] += add(store[component].update.time);

    // TODO: Time spent when the component renders
  }

  // Array of objects containing information the component name and total time spent in each stage
  const components = Object.keys(totalTime).reduce((acc, name) => {
    acc.push({ name, totalTime: totalTime[name] });
    return acc;
  }, []);

  // Net total time of all the components
  const netTotalTime = components.reduce(
    (acc, component) => (acc += component.totalTime),
    0
  );

  return sortComponents(components).map(component => ({
    componentName: component.name,
    totalTimeSpent: component.totalTime,
    numberOfInstances:
      store[component.name].mount.time.length -
      store[component.name].unmount.time.length,
    percentTimeSpent: percentage(component.totalTime / netTotalTime),
    mount: calPerfTime(store[component.name].mount.time),
    unmount: calPerfTime(store[component.name].unmount.time),
    render: calPerfTime(store[component.name].render.time),
    update: calPerfTime(store[component.name].update.time)
  }));
}

module.exports = generateComponentData
