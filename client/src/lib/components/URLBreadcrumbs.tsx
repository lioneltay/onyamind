import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { Breadcrumbs } from "lib/components"

type Props = Stylable & RouteComponentProps

function capitalize(str: string): string {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

class AccountBreadcrumbs extends React.Component<Props> {
  render() {
    return (
      <Breadcrumbs
        style={this.props.style}
        className={this.props.className}
        items={this.props.location.pathname
          .split("/")
          .filter(part => part)
          .map((part, index, parts) => ({
            text: capitalize(part),
            to: `/${parts.slice(0, index + 1).join("/")}`,
          }))}
      />
    )
  }
}

export default withRouter(AccountBreadcrumbs)
