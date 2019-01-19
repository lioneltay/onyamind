export function mapDictionary<A, B>(
  fn: (input: A) => B,
  input: Record<string, A>
): Record<string, B> {
  return Object.keys(input).reduce(
    (acc, key) => {
      const value = input[key]
      acc[key] = fn(value)
      return acc
    },
    {} as Record<string, B>
  )
}
