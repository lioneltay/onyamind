import React from "react"
import {
  renderWithWrappers,
  generateUser,
  getByText,
  getByTestId,
  wait,
} from "testing"
import user from "@testing-library/user-event"
import { Drawer, FeedbackModal } from "components/global"

describe("<Drawer />", () => {
  test("Able to open feedback modal from drawer", async () => {
    const r = renderWithWrappers(
      <React.Fragment>
        <Drawer />
        <FeedbackModal />
      </React.Fragment>,
      {
        initialState: {
          auth: {
            user: generateUser(),
          },
          ui: {
            showDrawer: true,
          },
        },
      },
    )

    user.click(r.getByText(/send feedback/i))

    await wait(() => {
      const modal = getByTestId(document.body, "modal")
      getByText(modal, /feedback/i)
    })
  })
})
