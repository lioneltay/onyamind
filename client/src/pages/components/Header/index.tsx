import React from "react"
import { Route, Switch } from "react-router-dom"

import ListPageHeader from "./ListPageHeader"
import TrashPageHeader from "./TrashPageHeader"

const Header: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/lists" component={ListPageHeader} />
      <Route path="/trash" component={TrashPageHeader} />
    </Switch>
  )
}

export default Header
