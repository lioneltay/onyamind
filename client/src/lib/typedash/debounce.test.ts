import { debounce } from "./debounce"

// test("placeholder", () => {
//   expect(1 + 2).toEqual(3)
// })

test("debounce synchronous", () => {
  const fn = jest.fn()
  const debounced = debounce(fn, 100)
  Array(5)
    .fill(null)
    .forEach(debounced)
  expect(fn).toBeCalledTimes(0)
})

test("debounce synchronous immediate", () => {
  const fn = jest.fn()
  const debounced = debounce(fn, 100, true)
  Array(5)
    .fill(null)
    .forEach(debounced)
  expect(fn).toBeCalledTimes(1)
})

test("debounce async fast", done => {
  const calls = 100
  const time = 425
  const debounce_time = 100

  const fn = jest.fn()
  const debounced = debounce(fn, debounce_time)

  Array(calls)
    .fill(null)
    .forEach((_, index) => setTimeout(debounced, (index / calls) * time))

  setTimeout(() => {
    expect(fn).toBeCalledTimes(0)
    done()
  }, time)
})

test("debounce async slow", done => {
  const calls = 4
  const time = 425
  const debounce_time = 100

  const fn = jest.fn()
  const debounced = debounce(fn, debounce_time)

  Array(calls)
    .fill(null)
    .forEach((_, index) => setTimeout(debounced, (index / calls) * time))

  setTimeout(() => {
    expect(fn).toBeCalledTimes(4)
    done()
  }, time)
})

test("debounce async fast immediate", done => {
  const calls = 100
  const time = 425
  const debounce_time = 100

  const fn = jest.fn()
  const debounced = debounce(fn, debounce_time, true)

  Array(calls)
    .fill(null)
    .forEach((_, index) => setTimeout(debounced, (index / calls) * time))

  setTimeout(() => {
    expect(fn).toBeCalledTimes(1)
    done()
  }, time)
})

test("debounce async slow immediate", done => {
  const calls = 4
  const time = 425
  const debounce_time = 100

  const fn = jest.fn()
  const debounced = debounce(fn, debounce_time, true)

  Array(calls)
    .fill(null)
    .forEach((_, index) => setTimeout(debounced, (index / calls) * time))

  setTimeout(() => {
    expect(fn).toBeCalledTimes(4)
    done()
  }, time)
})
