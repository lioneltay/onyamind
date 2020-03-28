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
    // <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <StylesProvider injectFirst>
          <ThemeProvider dark={false}>
            <GlobalStyles />
            <Root />
          </ThemeProvider>
        </StylesProvider>
      </Router>
    </ReduxProvider>
    // </React.StrictMode>
  )
}
