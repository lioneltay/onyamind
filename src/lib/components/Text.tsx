import React from "react"
import { noopTemplate as css } from "lib/utils"
import Typography, { TypographyProps } from "@material-ui/core/Typography"

export type TextProps = TypographyProps & {
  inline?: boolean
  component?: React.ElementType
}

export default ({ inline, ...props }: TextProps) => {
  return (
    <Typography
      {...props}
      color={props.color || "textPrimary"}
      css={css`
        ${inline ? `display: inline-block;` : undefined}
      `}
    />
  )
}
