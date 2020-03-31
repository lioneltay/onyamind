import React from "react"
import { Router } from "services/router"

import Root from "pages"
import GlobalStyles from "styles/global"

import { StylesProvider } from "@material-ui/core"
import { GlobalSnackbar } from "components"

import { store } from "services/store"
import { Provider as ReduxProvider } from "react-redux"

import { ThemeProvider } from "theme"

import * as api from "services/api"
import { useActions, useSelector } from "services/store"

import { assert } from "lib/utils"

export default () => {
  return (
    // <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <StylesProvider injectFirst>
          <ThemeProvider dark={false}>
            <GlobalStyles />
            <GlobalSnackbar />
            <App />
          </ThemeProvider>
        </StylesProvider>
      </Router>
    </ReduxProvider>
    // </React.StrictMode>
  )
}

const App = () => {
  const {
    app: { setTaskLists },
    auth: { setUser },
    ui: { openSnackbar, closeSnackbar },
  } = useActions()

  const userId = useSelector((state) => state.auth.user?.uid)

  React.useEffect(() => {
    if (userId) {
      return api.onTaskListsChange({
        userId,
        onChange: (lists) => setTaskLists(lists),
      })
    }
  }, [userId])

  React.useEffect(() => {
    return api.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
      } else {
        const { user: anonUser } = await api.signinAnonymously()
        assert(anonUser, "signinAnonmously Failed")
        await api.initializeUserData(anonUser.uid)
      }
    })
  })

  return (
    <div>
      <button
        style={{
          height: 100,
          width: 100,
        }}
        onClick={() => {
          openSnackbar({
            text: Date.now(),
          })
        }}
      >
        blarg
      </button>
      <button
        style={{
          height: 100,
          width: 100,
        }}
        onClick={() => {
          closeSnackbar()
        }}
      >
        close
      </button>
      <Root />
    </div>
  )
}
