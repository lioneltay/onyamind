export const assert = (condition: boolean, msg?: string): asserts condition => {
  if (!condition) {
    throw new Error(msg)
  }
}
