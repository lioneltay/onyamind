import React from "react"
import Typography, { TypographyProps } from "@material-ui/core/Typography"

export default (props: TypographyProps) => {
  return <Typography {...props} color={props.color || "textPrimary"} />
}
