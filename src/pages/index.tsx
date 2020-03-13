import React from "react"
import { noopTemplate as css } from "lib/utils"
import { Switch, Route, Redirect } from "react-router-dom"

import { Drawer, Header } from "components"

import ListPage from "./lists/Page"
import TrashPage from "./trash/Page"

import { useTheme } from "theme"

export default () => {
  const theme = useTheme()

  return (
    <div
      css={css`
        background: ${theme.backgroundFadedColor};
        min-height: 100vh;
      `}
    >
      <Header />
      <Drawer />

      <Switch>
        <Route path="/lists/:listId?/:listName?" component={ListPage} />
        <Route path="/trash" component={TrashPage} />
        <Route>{() => <Redirect to="/lists" />}</Route>
      </Switch>
    </div>
  )
}
