import React from "react"
import { Router as ReactRouter } from "react-router-dom"
import { createBrowserHistory } from "history"

export { matchPath } from "react-router-dom"

export const router = {
  history: createBrowserHistory(),
}

export const Router: React.SFC = ({ children }) => {
  return <ReactRouter history={router.history}>{children}</ReactRouter>
}
