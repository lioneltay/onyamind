import { generateIntervals } from "./index"

test("generateIntervals: should use minInterval when even intervals are too small", () => {
  expect(
    generateIntervals({
      minInterval: 10,
      maxInterval: 100,
      numberOfGroups: 3,
      range: [0, 30],
    })
  ).toEqual([[0, 10], [10, 20], [20, 30]])
})

test("generateIntervals: should use maxInterval when even intervals are too large", () => {
  expect(
    generateIntervals({
      minInterval: 10,
      maxInterval: 20,
      numberOfGroups: 3,
      range: [0, 80],
    })
  ).toEqual([[0, 20], [20, 40], [40, 60], [60, 80]])
})

test("generateIntervals: should use even intervals when possible", () => {
  expect(
    generateIntervals({
      minInterval: 10,
      maxInterval: 30,
      numberOfGroups: 5,
      range: [0, 100],
    })
  ).toEqual([[0, 20], [20, 40], [40, 60], [60, 80], [80, 100]])
})

test("generateIntervals: Intervals should begin from minimum of range", () => {
  expect(
    generateIntervals({
      minInterval: 10,
      maxInterval: 100,
      numberOfGroups: 3,
      range: [30, 60],
    })
  ).toEqual([[30, 40], [40, 50], [50, 60]])
})
