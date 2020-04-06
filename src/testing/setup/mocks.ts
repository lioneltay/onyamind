jest.mock("services/api", () => {
  return jest
    .requireActual("ramda")
    .mapObjIndexed(
      () => jest.fn(() => Promise.resolve()),
      jest.requireActual("services/api"),
    )
})

beforeEach(() => {
  jest.clearAllMocks()
})


/////