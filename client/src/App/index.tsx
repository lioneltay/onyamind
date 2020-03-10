import React from "react"
import { BrowserRouter } from "react-router-dom"

import Root from "pages"
import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"

import { store } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

export default () => {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <StylesProvider injectFirst>
          <GlobalStyles />
          <Root />
          <ShowState />
        </StylesProvider>
      </BrowserRouter>
    </ReduxProvider>
  )
}

import { useSelector, useActions } from "services/store/listPage"

const ShowState = () => {
  const state = useSelector(state => state)

  return <pre>{JSON.stringify(state, null, 2)}</pre>
}

import "./init"
