import { coalesce } from "./coalesce"

test("coalesce", () => {
  expect(coalesce(undefined, "default")).toEqual("default")
  expect(coalesce(null, "default")).toEqual("default")
  expect(coalesce("value", "default")).toEqual("value")
})
