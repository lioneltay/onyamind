import React from "react"
import { Router } from "services/router"

import Root from "pages"
import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"
import { Text } from "lib/components"

import { store } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

import { ThemeProvider } from "theme"

export default () => {
  return (
    <ReduxProvider store={store}>
      <Router>
        <StylesProvider injectFirst>
          <ThemeProvider dark={false}>
            <h1>STAGING</h1>
            <GlobalStyles />
            <Root />
          </ThemeProvider>
        </StylesProvider>
      </Router>
    </ReduxProvider>
  )
}
