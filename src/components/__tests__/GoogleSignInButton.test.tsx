import React from "react"
import { render } from "@testing-library/react"
import user from "@testing-library/user-event"
import GoogleSignInButton from "../GoogleSignInButton"

test("GoogleSignInButton responds to click", () => {
  const onClick = jest.fn()

  const { getByText } = render(<GoogleSignInButton onClick={onClick} />)

  const button = getByText(/sign in with google/i)

  user.click(button)

  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onClick).toHaveBeenCalledWith(expect.any(Object))
})
