import React from "react"
import { renderWithWrappers } from "testing"
import { wait } from "@testing-library/react"
import user from "@testing-library/user-event"
import GlobalSnackbar from "../GlobalSnackbar"

import { useActions } from "services/store"

describe("<GlobalSnackbar />", () => {
  const openButtonLabel = "open"
  type OpenSnackbarInput = Parameters<
    ReturnType<typeof useActions>["ui"]["openSnackbar"]
  >[0]

  type TesterProps = Omit<OpenSnackbarInput, "type"> & {
    type?: OpenSnackbarInput["type"]
  }

  const Tester = ({ text, closable, duration, type }: TesterProps) => {
    const { openSnackbar } = useActions("ui")

    return (
      <div>
        <button
          onClick={() =>
            openSnackbar({
              type: type || "success",
              text,
              closable,
              duration,
            })
          }
        >
          {openButtonLabel}
        </button>
        <GlobalSnackbar />
      </div>
    )
  }

  test("snackbar shows correct text", async () => {
    const text = "snackbar text"
    const { getByText } = renderWithWrappers(<Tester text={text} />)
    user.click(getByText(openButtonLabel))
    await wait(() => {
      getByText(text)
    })
  })
})
