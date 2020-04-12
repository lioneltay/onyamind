import React from "react"
import styled from "styled-components"
import { noopTemplate as css } from "lib/utils"

import { PlainModal, Button, ButtonProps, Text, A } from "lib/components"
import { IconButton } from "@material-ui/core"
import { ClearIcon } from "lib/icons"

import { signInWithProvider } from "services/api"

import {
  GoogleIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "./provider-icons"

import EmailSignInForm from "./EmailSignInForm"

import { useActions, useSelector } from "services/store"

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  padding-top: 50px;
`

const Content = () => {
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
        <ButtonOption
          onClick={() => providerSignIn("google")}
          icon={<GoogleIcon />}
        >
          {method} with Google
        </ButtonOption>

        <ButtonOption
          onClick={() => providerSignIn("facebook")}
          icon={<FacebookIcon />}
        >
          {method} with Facebook
        </ButtonOption>

        <ButtonOption
          onClick={() => providerSignIn("twitter")}
          icon={<TwitterIcon />}
        >
          {method} with Twitter
        </ButtonOption>

        <ButtonOption
          icon={<EmailIcon />}
          onClick={() => setEmailAuth((x) => !x)}
        >
          {method} with Email
        </ButtonOption>
      </div>

      <Text
        variant="body2"
        css={css`
          margin-top: 24px;
          margin-bottom: 24px;
        `}
      >
        {creatingAccount ? "Already have an account?" : "No account?"}{" "}
        <Text
          inline
          color="primary"
          variant="body2"
          role="button"
          onClick={() => setCreatingAccount((x) => !x)}
        >
          {creatingAccount ? "Sign in" : "Create one"}
        </Text>
      </Text>
    </ContentContainer>
  )
}

export default () => {
  const {
    ui: { closeAuthModal },
  } = useActions()

  const { open } = useSelector((state) => ({
    open: state.ui.showAuthModal,
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

type ButtonOptionProps = ButtonProps & {
  icon: React.ReactNode
}

const ButtonOption = ({
  icon,
  children,
  ...buttonProps
}: ButtonOptionProps) => {
  const iconContainerSize = 24
  const iconSize = 18

  return (
    <Button variant="outlined" color="default" {...buttonProps}>
      <div
        style={{
          height: iconContainerSize,
          width: iconContainerSize,
        }}
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;

          margin-right: 8px;

          width: ${iconContainerSize}px;
          height: ${iconContainerSize}px;

          & > svg {
            width: ${iconSize}px;
            height: ${iconSize}px;
          }
        `}
      >
        {icon}
      </div>
      <Text variant="body2">{children}</Text>
    </Button>
  )
}
