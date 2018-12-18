import React, { Fragment } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

const Separator = styled.i.attrs({ className: "fas fa-chevron-right" })`
  color: #5dadd5;
`

const Crumb = styled.span`
  color: inherit;
  font-size: 0.85rem;
  color: #777;

  &:visited {
    color: inherit;
  }
`

interface Item {
  to?: string
  text: string
}

type Props = Stylable & {
  items: Item[]
}

export default class Breadcrumbs extends React.Component<Props> {
  render() {
    const { items } = this.props

    return (
      <div
        className={`fa-c ${this.props.className || ""}`}
        style={this.props.style}
      >
        {items.map((item, index) => {
          const is_last_item = index === items.length - 1

          return (
            <Fragment key={index}>
              {typeof item.to !== "undefined" && !is_last_item ? (
                <Link to={item.to}>
                  <Crumb>{item.text}</Crumb>
                </Link>
              ) : (
                <Crumb style={{ cursor: "default" }}>{item.text}</Crumb>
              )}

              {!is_last_item && <Separator />}
            </Fragment>
          )
        })}
      </div>
    )
  }
}
