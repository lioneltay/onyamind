import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Modal, Button, Text } from "lib/components"

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
  return (
    <Modal open={true} onClose={onClose} title="Sign In">
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
          }
        `}
      >
        <ButtonOption icon={<GoogleIcon />}>Sign in with Google</ButtonOption>
        <ButtonOption icon={<FacebookIcon />}>
          Sign in with Facebook
        </ButtonOption>
        <ButtonOption icon={<TwitterIcon />}>Sign in with Twitter</ButtonOption>
        <ButtonOption icon={<EmailIcon />}>Sign in with Email</ButtonOption>
      </div>
    </Modal>
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
