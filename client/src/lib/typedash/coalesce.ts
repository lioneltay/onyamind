export function coalesce<T, U>(
  val: T | undefined | null,
  default_to: U,
): Exclude<T | U, null | undefined> {
  return (val === undefined || val === null ? default_to : val) as Exclude<
    T | U,
    null | undefined
  >
}
