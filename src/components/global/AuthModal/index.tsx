import React from "react"
import styled from "styled-components"
import { noopTemplate as css } from "lib/utils"

import { PlainModal, Button, ButtonProps, Text, A } from "lib/components"
import { IconButton } from "@material-ui/core"
import { ClearIcon } from "lib/icons"

import { signInWithProvider } from "services/api"

import { GoogleIcon, FacebookIcon, EmailIcon } from "lib/icons"

import EmailSignInForm from "./EmailSignInForm"

import { useActions, useSelector } from "services/store"

import { GoogleButton, FacebookButton, EmailButton } from "lib/login-buttons"

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  padding-top: 50px;
`

const Content = () => {
  const { mode } = useSelector((state) => ({
    mode: state.ui.authModal?.mode,
  }))

  const {
    ui: { closeAuthModal, openSnackbar },
    auth: { setUser },
  } = useActions()

  const [creatingAccount, setCreatingAccount] = React.useState(false)
  const [emailAuth, setEmailAuth] = React.useState(false)
  const method = creatingAccount ? "Sign up" : "Sign in"

  if (emailAuth) {
    return (
      <ContentContainer style={{ maxWidth: 320 }}>
        <EmailSignInForm
          goBack={() => setEmailAuth(false)}
          creatingAccount={creatingAccount}
        />
      </ContentContainer>
    )
  }

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
    <ContentContainer style={{ maxWidth: 320 }}>
      <Text variant="h5" align="center" style={{ marginBottom: 24 }}>
        {creatingAccount ? "Join Onyamind" : "Welcome back"}
      </Text>

      <Text variant="body2" align="center" style={{ marginBottom: 24 }}>
        {method} to synchronize your tasks and view them across multiple devices
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
          {method} with Google
        </GoogleButton>

        <FacebookButton onClick={() => providerSignIn("facebook")}>
          {method} with Facebook
        </FacebookButton>

        <EmailButton onClick={() => setEmailAuth((x) => !x)}>
          {method} with Email
        </EmailButton>
      </div>

      {!mode ? (
        <Text
          variant="body2"
          css={css`
            margin-top: 24px;
          `}
        >
          {creatingAccount ? "Already have an account?" : "No account?"}{" "}
          <Text
            display="inline"
            color="primary"
            variant="body2"
            role="button"
            onClick={() => setCreatingAccount((x) => !x)}
          >
            {creatingAccount ? "Sign in" : "Create one"}
          </Text>
        </Text>
      ) : null}
    </ContentContainer>
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
        width: 480px;
        max-width: 100vw;
        position: relative;
      `}
    >
      <IconButton
        css={css`
          position: absolute;
          top: 0;
          right: 0;
        `}
        onClick={closeAuthModal}
      >
        <ClearIcon />
      </IconButton>

      <Content />
    </PlainModal>
  )
}
