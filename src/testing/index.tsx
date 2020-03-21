import React from "react"
import { Router } from "services/router"
import { render as rtlRender } from "@testing-library/react"

import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"

import { store } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

import { ThemeProvider } from "theme"

const Wrapper: React.FC = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <Router>
        <StylesProvider injectFirst>
          <ThemeProvider dark={false}>
            <GlobalStyles />
            {children}
          </ThemeProvider>
        </StylesProvider>
      </Router>
    </ReduxProvider>
  )
}

export const renderWithWrappers = (
  ui: Parameters<typeof rtlRender>[0],
  options?: Parameters<typeof rtlRender>[1],
) => {
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}
