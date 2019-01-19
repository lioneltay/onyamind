// Creates a new partially applied function
export function bind<T1, T2, T3, U extends any[], V>(
  f: (t1: T1, t2: T2, t3: T3, ...args: U) => V,
  t1: T2,
  t2: T2,
  t3: T3,
): (...args: U) => V
export function bind<T1, T2, U extends any[], V>(
  f: (t1: T1, t2: T2, ...args: U) => V,
  t1: T2,
  t2: T2,
): (...args: U) => V
export function bind<T, U extends any[], V>(
  f: (x: T, ...args: U) => V,
  x: T,
): (...args: U) => V
export function bind<V>(
  f: (...args: any[]) => V,
  ...args: any[]
): (...args: any[]) => V {
  return (...more_args: any[]) => f(...args, ...more_args)
}
