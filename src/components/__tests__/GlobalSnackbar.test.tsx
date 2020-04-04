import React from "react"
import { renderWithWrappers } from "testing"
import { wait } from "@testing-library/react"
import user from "@testing-library/user-event"
import GlobalSnackbar from "../GlobalSnackbar"

import { useActions } from "services/store"

describe("<GlobalSnackbar />", () => {
  const openButtonLabel = "open"
  const Tester = ({
    text,
    actions,
    closable,
    duration,
    onClose,
  }: Parameters<ReturnType<typeof useActions>["ui"]["openSnackbar"]>[0]) => {
    const { openSnackbar } = useActions("ui")

    return (
      <div>
        <button
          onClick={() =>
            openSnackbar({
              text,
              actions,
              onClose,
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

  test("snackbar actions call handlers, onClose and close the snackbar", async () => {
    const onClose = jest.fn()
    const actions = [
      {
        label: "action1",
        handler: jest.fn(),
      },
      {
        label: "action2",
        handler: jest.fn(() => console.log("action2")),
      },
    ]

    const { getByText, queryByText, queryByTestId } = renderWithWrappers(
      <Tester text="text" onClose={onClose} actions={actions} />,
    )

    const button = getByText(openButtonLabel)

    user.click(button)

    await wait(() => {
      getByText(actions[0].label)
      getByText(actions[1].label)
      // Close button is not enabled by default
      expect(queryByTestId("clear")).toBeNull()
    })

    user.click(getByText(actions[0].label))

    await wait(() => {
      expect(queryByText(actions[0].label)).toBeNull()
      expect(queryByText(actions[1].label)).toBeNull()

      expect(actions[0].handler).toHaveBeenCalledTimes(1)
      expect(actions[1].handler).toHaveBeenCalledTimes(0)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  test("snackbar closeable functionality works", async () => {
    const onClose = jest.fn()

    const { queryByTestId, getByTestId, getByText } = renderWithWrappers(
      <Tester text="text" onClose={onClose} closable />,
    )

    user.click(getByText(openButtonLabel))
    await wait(() => {
      getByTestId("clear")
    })
    user.click(getByTestId("clear"))

    await wait(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(queryByTestId("clear")).toBeNull()
    })
  })

  //   test.only("snackbar closes automatically after some time", async () => {
  //     jest.useFakeTimers()
  //     const text = "snackbar text"
  //     const onClose = jest.fn()

  //     const { getByText, queryByText } = renderWithWrappers(
  //       <Tester text={text} onClose={onClose} />,
  //     )

  //     user.click(getByText(openButtonLabel))
  //     // https://github.com/testing-library/react-testing-library/issues/244
  //     Promise.resolve().then(() => jest.runOnlyPendingTimers())

  //     await wait(() => {
  //       getByText(text)
  //     })

  //     // Promise.resolve().then(jest.runAllTimers)

  //     // await wait(() => {
  //       expect(queryByText(text)).toBeNull()
  //       expect(onClose).toHaveBeenCalledTimes(1)
  //     // })

  //     jest.useRealTimers()
  //   })
})
