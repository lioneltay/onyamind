import { mapDictionary } from "./mapDictionary"

test("", () => {
  const input: Record<string, number> = {
    a: 1,
    b: 2,
  }

  const output: Record<string, string> = {
    a: "2",
    b: "3",
  }

  expect(mapDictionary(x => `${x + 1}`, input)).toEqual(output)
})
