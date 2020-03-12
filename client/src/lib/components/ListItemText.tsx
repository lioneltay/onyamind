import React from "react"
import ListItemText, { ListItemTextProps } from "@material-ui/core/ListItemText"

export default (props: ListItemTextProps) => {
  return (
    <ListItemText
      {...props}
      primaryTypographyProps={
        props.primaryTypographyProps || { color: "textPrimary" }
      }
    />
  )
}
