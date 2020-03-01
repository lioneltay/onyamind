import React from "react"
import { BrowserRouter } from "react-router-dom"

import Root from "pages"
import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"

import { store } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

class App extends React.Component {
  render() {
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
}

export default App

import { useSelector, useActions } from "services/store"

const ShowState = () => {
  const state = useSelector(state => state)

  return <pre>{JSON.stringify(state, null, 2)}</pre>
}

import "./init"
