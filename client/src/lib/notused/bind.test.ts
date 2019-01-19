import { bind } from "./bind"

test("bind", () => {
  const multiply = (a: number, b: number) => a * b
  const multiplyAdd = (a: number, b: number, c: number) => a * b + c

  const double = bind(multiply, 2)
  const add8 = bind(multiplyAdd, 2, 4)

  expect(multiply.length).toEqual(2)
  expect(double.length).toEqual(0)
  expect([1, 2, 3, 4].map(double)).toEqual([2, 4, 6, 8])

  expect(multiplyAdd.length).toEqual(3)
  expect(add8.length).toEqual(0)
  expect([1, 2, 3, 4].map(add8)).toEqual([9, 10, 11, 12])

  expect(bind.length).toEqual(1)
  expect(1).toEqual(1)
})
