export const debounce = (fn: FunctionType, ms: number, immediate?: boolean) => {
  let timeout_id: undefined | NodeJS.Timer
  let next_call: number = 0

  return !immediate
    ? (...args: Arguments<typeof fn>): void => {
        if (timeout_id) {
          clearTimeout(timeout_id)
        }
        timeout_id = setTimeout(() => fn(...args), ms)
      }
    : (...args: Arguments<typeof fn>): void => {
        const now = Date.now()
        if (next_call < now) {
          fn(...args)
        }
        next_call = now + ms
      }
}
