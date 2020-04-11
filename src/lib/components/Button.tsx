import React from "react"
import { noopTemplate as css } from "lib/utils"
import Button, { ButtonProps as MButtonProps } from "@material-ui/core/Button"

export type ButtonProps = MButtonProps

export default (props: ButtonProps) => (
  <Button
    css={css`
      text-transform: none;
    `}
    {...props}
  />
)
