import React from "react"
import { Switch, Route } from "react-router-dom"

import SettingsPage from "./settings/Page"

export default () => {
  return (
    <Switch>
      <Route path="/profile/settings" component={SettingsPage} />
    </Switch>
  )
}
