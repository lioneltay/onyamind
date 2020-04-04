import React from "react"
import * as faker from "faker"
import { Router } from "services/router"
import { render as rtlRender } from "@testing-library/react"

import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"

import { configureStore, State } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

import { ThemeProvider } from "theme"

type RenderWithWrappersOptions = Parameters<typeof rtlRender>[1] & {
  initialState?: RecursivePartial<State>
}

export const renderWithWrappers = (
  ui: Parameters<typeof rtlRender>[0],
  options?: RenderWithWrappersOptions,
) => {
  const store = configureStore({ initialState: options?.initialState })

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

  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export const generateUser = (user?: Partial<User>): User => {
  return {
    displayName: faker.internet.userName(),
    email: faker.internet.email(),
    isAnonymous: faker.random.boolean(),
    photoURL: faker.image.imageUrl(),
    uid: faker.random.alphaNumeric(),
    ...user,
  }
}
