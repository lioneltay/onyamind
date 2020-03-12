import React from "react"
import { noopTemplate as css } from "lib/utils"
import { Switch, Route } from "react-router-dom"

import Header from "./components/Header"
import Drawer from "./components/Drawer"

import ListPage from "./lists"

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
        <Route path="/lists/:listId/:listName" component={ListPage} />
      </Switch>
    </div>
  )
}
