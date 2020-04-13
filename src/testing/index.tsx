import React from "react"
import * as faker from "faker"
import { Router } from "services/router"
import {
  render as rtlRender,
  buildQueries,
  queryHelpers,
  queries,
  RenderResult as RTLRenderResult,
  MatcherOptions,
  Matcher,
} from "@testing-library/react"

import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"

import { configureStore, State } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

import { ThemeProvider } from "theme"

export * from "@testing-library/react"

const queryAllByIconName = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => queryHelpers.queryAllByAttribute("data-icon-name", container, id, options)

const getMultipleError = (c: any, iconName: string) =>
  `Found multiple elements with the data-icon-name attribute of: ${iconName}`
const getMissingError = (c: any, iconName: string) =>
  `Unable to find an element with the data-icon-name attribute of: ${iconName}`

const [
  queryByIconName,
  getAllByIconName,
  getByIconName,
  findAllByIconName,
  findByIconName,
] = buildQueries(queryAllByIconName, getMultipleError, getMissingError)

const allQueries = {
  ...queries,
  queryAllByIconName,
  queryByIconName,
  getAllByIconName,
  getByIconName,
  findAllByIconName,
  findByIconName,
} as const

type RenderResult = RTLRenderResult<typeof allQueries>

const render = (
  ui: Parameters<typeof rtlRender>[0],
  options?: RenderWithWrappersOptions,
): RenderResult => {
  return rtlRender(ui, { queries: allQueries, ...options }) as RenderResult
}

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

  return render(ui, { wrapper: Wrapper, ...options })
}

export const generateUser = (user?: Partial<User>): User => {
  return {
    displayName: faker.internet.userName(),
    email: faker.internet.email(),
    isAnonymous: faker.random.boolean(),
    photoURL: faker.image.imageUrl(),
    uid: faker.random.alphaNumeric(),
    providerData: [],
    ...user,
  }
}
