import { equals } from "ramda"

export * from "./bind"
export * from "./generateIntervals"
export * from "./mapDictionary"
export { head, tail, last, init } from "./array-access"
export { coalesce } from "./coalesce"
export { debounce } from "./debounce"
export { merge } from "./merge"

export function noop() {}

export function assertNever(input: never): never {
  return undefined as never
}

export function flatten<T>(input: T[][]): T[] {
  return input.reduce((acc, arr) => acc.concat(arr), [])
}

export function isNil<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === undefined || value === null
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function ensureStartsWith(prefix: string, str: string): string {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}

export function partition<T>(pred: (val: T) => boolean, arr: T[]): [T[], T[]] {
  const truthy: T[] = []
  const falsey: T[] = []

  arr.forEach(val => (pred(val) ? truthy.push(val) : falsey.push(val)))

  return [truthy, falsey]
}

export function noopTemplate(
  strings: TemplateStringsArray,
  ...vars: any[]
): string {
  return (
    vars.map((input, index) => strings[index] + input).join("") +
    (strings.length !== vars.length ? strings[strings.length - 1] : "")
  )
}

export function modulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo
}

export function inBrowser(): boolean {
  return typeof window === "object"
}

export function indexBy<T>(
  fn: (a: T) => string | number,
  list: T[],
): Record<string, T> {
  return list.reduce(
    (acc, item) => {
      acc[fn(item).toString()] = item
      return acc
    },
    {} as Record<string, T>,
  )
}

export function path(
  keys: string | string[],
  obj: Record<string | number, any>,
): any {
  if (Array.isArray(keys)) {
    return keys.reduce(
      (val, key) => (typeof val === "object" ? val[key] : val),
      obj,
    )
  }

  return path(keys.split(/\.|\[|\]\.*/), obj)
}

export function urlSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function clamp(min: number, max: number, val: number): number {
  return Math.max(min, Math.min(max, val))
}

export function parseQueryString(query: string): Record<string, any> {
  return ensureStartsWith("?", query)
    .slice(1)
    .split("&")
    .map(pair => pair.split("="))
    .filter(pair => pair.length === 2)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: decodeURI(value) }), {})
}

export function encodeQueryParams(queryParams: Record<string, any>) {
  return Object.keys(queryParams)
    .reduce(
      (acc, key) => [...acc, `${key}=${queryParams[key].toString()}`],
      [] as string[],
    )
    .join("&")
}

export function stringifyQueryParams(queryParams: object) {
  return encodeURIComponent(JSON.stringify(queryParams))
}

export function uniqueBy<T>(
  keyFn: (item: T) => string | number,
  items: T[],
): T[] {
  const map: { [key: string]: T } = {}

  items.forEach(item => (map[keyFn(item)] = item))

  return Object.values(map)
}

export function extremums(values: number[]): [number, number] {
  let min = Infinity
  let max = -Infinity

  values.forEach(val => {
    if (val < min) {
      min = val
    }

    if (val > max) {
      max = val
    }
  })

  return [min, max]
}

export function move<T>(from: number, to: number, arr: T[]): T[] {
  const items = [...arr]
  items.splice(to, 0, items.splice(from, 1)[0])
  return items
}

export function update<T>(index: number, data: T, arr: T[]): T[] {
  const items = [...arr]
  items.splice(index, 1, data)
  return items
}

export const always = <T extends any>(val: T) => () => val
