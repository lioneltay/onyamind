import React from "react"
import { Route, Switch } from "react-router-dom"

import BasicHeader from "./components/BasicHeader"
import ListPageHeader from "./ListPageHeader"

export default () => {
  return (
    <Switch>
      <Route
        path="/profile"
        component={() => <BasicHeader title="Settings" />}
      />
      <Route path="/lists/:listId?" component={ListPageHeader} />
    </Switch>
  )
}
