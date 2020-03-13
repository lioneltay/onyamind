export const notNil = <T extends any>(val: undefined | null | T): val is T =>
  val !== undefined && val !== null
