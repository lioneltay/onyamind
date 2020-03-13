import React from "react"
import { BrowserRouter } from "react-router-dom"

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
      <BrowserRouter>
        <StylesProvider injectFirst>
          <ThemeProvider dark={true}>
            <GlobalStyles />
            <Root />
          </ThemeProvider>
        </StylesProvider>
      </BrowserRouter>
    </ReduxProvider>
  )
}
