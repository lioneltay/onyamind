import React from "react"
import { Switch, Route } from "react-router-dom"

import Header from "./components/Header"
import Drawer from "./components/Drawer"
import ListPage from "./lists"

export default () => {
  return (
    <div>
      <Header />
      {/* <Drawer /> */}

      <Switch>
        {/* <Route path="/lists/:listId/:listName" component={ListPage} /> */}
      </Switch>
    </div>
  )
}
