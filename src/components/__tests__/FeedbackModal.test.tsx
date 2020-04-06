import React from "react"
import { render, wait } from "testing"
import user from "@testing-library/user-event"
import FeedbackModal from "../Drawer/FeedbackModal"

// jest.mock("services/api", () => ({
//   sendFeedback: jest.fn(() => Promise.resolve(null)),
// }))

test("Feedback form calls on submit with input values", async () => {
  const onSubmit = jest.fn(() => Promise.resolve())

  const { getByPlaceholderText, getByText } = render(
    <FeedbackModal onClose={jest.fn()} open={true} onSubmit={onSubmit} />,
  )

  const subject = "New issue"
  const description = "This is a new issue"

  const subjectInput = getByPlaceholderText(/subject/i)
  await user.type(subjectInput, subject)

  const descriptionInput = getByPlaceholderText(/description/i)
  await user.type(descriptionInput, description)

  const submitButton = getByText(/submit/i)

  user.click(submitButton)

  await wait(() => {
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      {
        subject,
        description,
      },
      expect.anything(),
    )
  })
})

test("Feedback button calls onClose when cancel button is clicked", () => {
  const onClose = jest.fn()

  const { getByText } = render(
    <FeedbackModal onClose={onClose} open={true} onSubmit={jest.fn()} />,
  )

  const cancelButton = getByText(/cancel/i)
  user.click(cancelButton)

  expect(onClose).toHaveBeenCalledTimes(1)
})
