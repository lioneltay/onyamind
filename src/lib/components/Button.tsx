import React from "react"
import { noopTemplate as css } from "lib/utils"
import Button, { ButtonProps } from "@material-ui/core/Button"

export default (props: ButtonProps) => (
  <Button
    css={css`
      text-transform: none;
    `}
    {...props}
  />
)
