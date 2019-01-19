export function head<T>(list: T[]): T {
  return list[0]
}

export function last<T>(list: T[]): T {
  return list[list.length - 1]
}

export function init<T>(list: T[]): T[] {
  return list.slice(0, list.length - 1)
}

export function tail<T>(list: T[]): T[] {
  return list.slice(1)
}
