import React from "react"

import AuthModal from "./AuthModal"

import { useActions, useSelector } from "services/store"

export default () => {
  const {
    ui: { closeAuthModal },
  } = useActions()

  const { open } = useSelector((state) => ({
    open: state.ui.showAuthModal,
  }))

  return <AuthModal open={open} onClose={closeAuthModal} />
}
