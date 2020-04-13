import React from "react"
import { Route, Switch } from "react-router-dom"

import BasicHeader from "./components/BasicHeader"
import ListPageHeader from "./ListPageHeader"
import TrashPageHeader from "./TrashPageHeader"

export default () => {
  return (
    <Switch>
      <Route
        path="/profile"
        component={() => <BasicHeader title="Settings" />}
      />
      <Route path="/lists/:listId?" component={ListPageHeader} />
      <Route path="/trash" component={TrashPageHeader} />
    </Switch>
  )
}
