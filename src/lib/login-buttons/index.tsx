import React from "react"
import { noopTemplate as css } from "lib/utils"
import { GoogleIcon, FacebookIcon, EmailIcon } from "lib/icons"
import { Button, ButtonProps, Text } from "lib/components"

type LoginButtonProps = ButtonProps & {
  icon: React.ReactNode
}

const LoginButton = ({ icon, children, ...buttonProps }: LoginButtonProps) => {
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

function createLoginButton(icon: React.ReactNode) {
  return (props: ButtonProps) => <LoginButton icon={icon} {...props} />
}

export const GoogleButton = createLoginButton(<GoogleIcon />)
export const FacebookButton = createLoginButton(<FacebookIcon />)
export const EmailButton = createLoginButton(<EmailIcon />)
