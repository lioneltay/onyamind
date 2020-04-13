import React from "react"
import { render } from "@testing-library/react"
// import { renderWithWrappers as render } from "testing"
import HeaderBase from "../HeaderBase"

jest.mock("services/store", () => ({
  useActions: () => ({
    ui: {
      toggleDrawer: () => {},
    },
  }),
}))

jest.mock("theme", () => ({
  useTheme: () => ({}),
}))

describe("HeaderBase", () => {
  test("renders multiselectActions when multiselect is true", () => {
    const text = "actions rendered"
    const { getByText } = render(
      <HeaderBase
        title="anything"
        multiselect={true}
        numberOfSelectedTasks={1}
        numberOfTasks={3}
        multiselectActions={<div>{text}</div>}
      />,
    )

    getByText(text)
  })

  test("does not renders multiselectActions when multiselect is false", () => {
    const text = "actions rendered"
    const { queryByText } = render(
      <HeaderBase
        title="anything"
        multiselect={false}
        numberOfSelectedTasks={1}
        numberOfTasks={3}
        multiselectActions={<div>{text}</div>}
      />,
    )

    expect(queryByText(text)).toBeNull()
  })
})
