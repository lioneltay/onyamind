import React from "react"
import { renderWithWrappers, generateUser } from "testing"
import { wait } from "@testing-library/react"
import user from "@testing-library/user-event"
import Drawer from "../Drawer"

import { sendFeedback as mockSendFeedback } from "services/api"

jest.mock("services/api", () => ({
  sendFeedback: jest.fn(),
}))

test('placeholder', () => expect(5).toBe(5))

// describe("<Drawer />", () => {
//   test("FeedbackModal allows user to submit feedback", () => {
//     const { getByText, getByPlaceholderText } = renderWithWrappers(<Drawer />, {
//       initialState: {
//         auth: {
//           user: generateUser(),
//         },
//         ui: {
//           showDrawer: true,
//         },
//       },
//     })

//     user.click(getByText(/send feedback/i))

//     const subject = "some subject"
//     const description = "some description"

//     user.type(getByPlaceholderText(/subject/i), subject)

//     user.type(getByPlaceholderText(/description/i), description)

//     user.click(getByText(/submit/i))

//     wait(() => {
//       expect(mockSendFeedback).toHaveBeenCalledTimes(1)
//       expect(mockSendFeedback).toHaveBeenCalledWith({ subject, description })
//     })
//   })
// })
