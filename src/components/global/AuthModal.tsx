import React from "react"
import { noopTemplate as css } from "lib/utils"

import { PlainModal, Text } from "lib/components"
import { IconButton } from "@material-ui/core"
import { ClearIcon } from "lib/icons"

import { signInWithProvider } from "services/api"

import { useActions, useSelector } from "services/store"

import { GoogleButton, FacebookButton } from "lib/login-buttons"

const Content = () => {
  const {
    ui: { closeAuthModal, openSnackbar },
    auth: { setUser },
  } = useActions()

  async function providerSignIn(
    ...args: Parameters<typeof signInWithProvider>
  ) {
    await signInWithProvider(...args)
      .then((user) => {
        setUser(user)
        closeAuthModal()
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          openSnackbar({
            type: "error",
            text: "An account with this email already exists",
          })
          return
        }

        throw error
      })
  }

  return (
    <div
      style={{ maxWidth: 320 }}
      css={css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
      `}
    >
      <Text variant="h5" align="center" style={{ marginBottom: 24 }}>
        Sign in
      </Text>

      <Text variant="body2" align="center" style={{ marginBottom: 24 }}>
        Sign in to synchronize your tasks and view them across multiple devices
      </Text>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          margin-bottom: 24px;

          & > * {
            margin-top: 10px;
          }

          &:first-child {
            margin-top: 0px;
          }

          & button {
            display: flex;
            justify-content: flex-start;
            min-width: 210px;
          }
        `}
      >
        <GoogleButton onClick={() => providerSignIn("google")}>
          Sign in with Google
        </GoogleButton>

        <FacebookButton onClick={() => providerSignIn("facebook")}>
          Sign in with Facebook
        </FacebookButton>
      </div>
    </div>
  )
}

export default () => {
  const {
    ui: { closeAuthModal },
  } = useActions()

  const { open } = useSelector((state) => ({
    open: !!state.ui.authModal,
  }))

  return (
    <PlainModal
      open={open}
      onClose={closeAuthModal}
      className="fj-c"
      css={css`
        max-width: 100vw;
        position: relative;
      `}
    >
      <IconButton
        css={css`
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
        `}
        onClick={() => {
          console.log('close')
          closeAuthModal()
        }}
      >
        <ClearIcon />
      </IconButton>

      <Content />
    </PlainModal>
  )
}
