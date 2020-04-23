import React from "react"
import { noopTemplate as css } from "lib/utils"
import { Switch, Route, Redirect } from "react-router-dom"

import ListPage from "./lists/Page"
import TrashPage from "./trash/Page"
import ProfilePage from "./profile/Page"

import { useTheme } from "theme"

import { GlobalComponents } from "components"

export default () => {
  const theme = useTheme()

  return (
    <div
      className="fd-c"
      css={css`
        background: ${theme.backgroundColor};
        min-height: 100vh;
      `}
    >
      <GlobalComponents />

      <Switch>
        <Route path="/profile" component={ProfilePage} />
        <Route path="/lists/:listId?" component={ListPage} />
        <Route path="/trash" component={TrashPage} />
        <Route>{() => <Redirect to="/lists" />}</Route>
      </Switch>
    </div>
  )
}
