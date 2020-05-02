import React from "react"
import LibLinkify, { Props } from "react-linkify"
import { A } from "./Anchor"

export type LinkifyProps = Props

const Linkify = (props: LinkifyProps) => {
  return (
    <LibLinkify
      componentDecorator={(href, text, key) => (
        <A
          href={href}
          onClick={(event: any) => {
            event.stopPropagation()
          }}
        >
          {text}
        </A>
      )}
      {...props}
    />
  )
}

export default Linkify
