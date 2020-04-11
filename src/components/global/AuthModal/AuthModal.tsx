import React from "react"
import { noopTemplate as css } from "lib/utils"

import { PlainModal, Button, Text, A } from "lib/components"

import * as api from "services/api"

import {
  GoogleIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "./provider-icons"

type Props = {
  open: boolean
  onClose: () => void
}

export default ({ open, onClose }: Props) => {
  const [newUser, setNewUser] = React.useState(false)
  const method = newUser ? "Sign up" : "Sign in"

  return (
    <PlainModal
      open={true}
      onClose={onClose}
      title="Sign In"
      className="fj-c"
      css={css`
        width: 480px;
        max-width: 100vw;
      `}
    >
      <div
        className="fd-c fa-c"
        css={css`
          padding: 16px;
          max-width: 320px;
        `}
      >
        <Text variant="h5" align="center" style={{ marginBottom: 24 }}>
          Welcome back
        </Text>

        <Text variant="body2" align="center" style={{ marginBottom: 24 }}>
          Sign in to synchronize your tasks and view them across multiple
          devices
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
          <ButtonOption icon={<GoogleIcon />}>
            {method} with Google
          </ButtonOption>
          <ButtonOption icon={<FacebookIcon />}>
            {method} with Facebook
          </ButtonOption>
          <ButtonOption icon={<TwitterIcon />}>
            {method} with Twitter
          </ButtonOption>
          <ButtonOption icon={<EmailIcon />}>{method} with Email</ButtonOption>
        </div>

        <Text
          variant="body2"
          css={css`
            margin-top: 24px;
            margin-bottom: 24px;
          `}
        >
          No account?{" "}
          <Text
            inline
            color="primary"
            variant="body2"
            role="button"
            onClick={() => setNewUser((x) => !x)}
          >
            Create one
          </Text>
        </Text>
      </div>
    </PlainModal>
  )
}

type ButtonOptionProps = {
  children: React.ReactNode
  icon: React.ReactNode
}

const ButtonOption = ({ icon, children }: ButtonOptionProps) => {
  const iconContainerSize = 24
  const iconSize = 18

  return (
    <Button variant="outlined" color="default">
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
