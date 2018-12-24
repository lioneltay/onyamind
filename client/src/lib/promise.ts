export async function sequenceMap<T, U>(
  [first, ...rest]: U[],
  fn: (input: U) => Promise<T>,
): Promise<T[]> {
  return first ? [await fn(first), ...(await sequenceMap(rest, fn))] : []
}
