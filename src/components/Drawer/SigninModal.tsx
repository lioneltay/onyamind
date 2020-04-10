import React from "react"

import { Modal, Text } from "lib/components"

import { auth, firebase } from "services/firebase"

import {
  GoogleLoginButton,
  FacebookLoginButton,
  TwitterLoginButton,
} from "react-social-login-buttons"

import { useActions } from "services/store"

type Props = {
  open: boolean
  onClose: () => void
}

export default ({ open, onClose }: Props) => {
  const {
    auth: { signin },
  } = useActions()

  return (
    <Modal open={open} onClose={onClose} title="Sign In">
      <GoogleLoginButton
        onClick={async () => {
          console.log("hello?")
          await signin()
          console.log("DONE")
          onClose()
        }}
      />
      {/* <FacebookLoginButton /> */}
      {/* <TwitterLoginButton /> */}
    </Modal>
  )
}
