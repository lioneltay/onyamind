import React from "react"

import Drawer from "./Drawer"
import GlobalSnackbar from "./GlobalSnackbar"
import FeedbackModal from "./FeedbackModal"
import AuthModal from "./AuthModal"

export default () => {
  return (
    <React.Fragment>
      <Drawer />
      <GlobalSnackbar />
      <FeedbackModal />
      <AuthModal />
    </React.Fragment>
  )
}

export { default as Drawer } from "./Drawer"
export { default as GlobalSnackbar } from "./GlobalSnackbar"
export { default as FeedbackModal } from "./FeedbackModal"
export { default as AuthModal } from "./AuthModal"
