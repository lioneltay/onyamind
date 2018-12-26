
declare global {
  type Omit<T extends object, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  // Merge the keys of B into A, overwrite any duplicate keys (eg: { ...A, ...B }: Merge<A, B>)
  type Merge<A, B> = Pick<A, Exclude<keyof A, keyof B>> & B
}

export {}
