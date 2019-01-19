import React from "react"
import { render } from "react-dom"

import App from "./App"
import { BrowserRouter } from "react-router-dom"

import "./service-worker/service.worker.ts"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service.worker.js")
      .then(registration => console.log("SW registered: ", registration))
      .catch(registrationError =>
        console.log("SW registration failed: ", registrationError),
      )
  })
}

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core"
import { indigo } from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: { primary: indigo },
})

const container = document.getElementById("app")
if (container) {
  render(
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </BrowserRouter>,
    container,
  )
}
