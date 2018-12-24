export function merge<T extends object, U extends object>(
  a: T,
  b: U,
): Merge<T, U> {
  return { ...(a as any), ...(b as any) }
}
