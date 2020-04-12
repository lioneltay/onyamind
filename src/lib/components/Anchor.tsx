import React from "react"
import { noopTemplate as css } from "lib/utils"
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom"
import Text, { TextProps } from "./Text"

export type AProps = TextProps &
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >

export const A = (props: AProps) => {
  return <Text component="a" {...props} color={props.color || "primary"} />
}

export type LinkProps = TextProps & RouterLinkProps

export const Link = (props: LinkProps) => {
  return (
    <Text component={RouterLink} {...props} color={props.color || "primary"} />
  )
}
