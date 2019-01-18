import React from "react"
import Task from "../Task"
import { render, fireEvent } from "react-testing-library"

test("Task callback handlers are called when triggered", () => {
  const props = {
    onEdit: jest.fn(),
    onRemove: jest.fn(),

    task: {
      complete: false,
      created_at: Date.now(),
      updated_at: Date.now(),
      id: "12345",
      uid: null,
      title: "Test Task",
      notes: "Test Task Notes",
    },
  }
  const { container } = render(<Task {...props} />)

  const delete_cross = container.querySelector(".fa-times")!
  const checkbox = container.querySelector(`[type="radio"]`)!

  fireEvent.click(checkbox)
  fireEvent.click(delete_cross)

  expect(props.onEdit).toHaveBeenCalledTimes(1)
  expect(props.onRemove).toHaveBeenCalledTimes(1)
})
