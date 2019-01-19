import { uniqueBy } from "./index"

function floorBy(precision: number, val: number) {
  return Math.floor(val / precision) * precision
}

function ceilBy(precision: number, val: number) {
  return Math.ceil(val / precision) * precision
}

function produceInterals({
  from,
  size,
  intervals,
  precision,
}: {
  from: number
  size: number
  intervals: number
  precision?: number
}): [number, number][] {
  const generatedIntervals = Array(intervals)
    .fill(null)
    .map(
      (_, index) =>
        [from + index * size, from + (index + 1) * size].map(val => {
          if (!precision) {
            return val
          }
          return Math.round(val / precision) * precision
        }) as [number, number]
    )
    .filter(([min, max]) => min !== max)

  return uniqueBy(x => x.toString(), generatedIntervals)
}

interface GenerateIntervalsInput {
  minInterval: number
  maxInterval: number
  numberOfGroups: number
  range: [number, number]
  precision?: number
}

export function generateIntervals({
  minInterval,
  maxInterval,
  numberOfGroups,
  range,
  precision,
}: GenerateIntervalsInput) {
  const min = precision ? floorBy(precision, range[0]) : range[0]
  const max = precision ? ceilBy(precision, range[1]) : range[1]
  const difference = max - min

  // Can fill difference with minIntervals
  if (difference <= minInterval * numberOfGroups) {
    return produceInterals({
      from: min,
      precision,
      size: minInterval,
      intervals: Math.ceil(difference / minInterval),
    })
  }

  // Can't fill with numberOfGroups using max interval
  if (difference >= maxInterval * numberOfGroups) {
    return produceInterals({
      from: min,
      precision,
      size: maxInterval,
      intervals: Math.ceil(difference / maxInterval),
    })
  }

  // Difference can be filled with intervals between minInterval and maxInterval
  const intervalSize = Math.ceil(difference / numberOfGroups)
  return produceInterals({
    from: min,
    precision,
    size: intervalSize,
    intervals: Math.ceil(difference / intervalSize),
  })
}
