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

import { createGenerateClassName, jssPreset } from "@material-ui/core/styles"
import { create } from "jss"
import { JssProvider } from "react-jss"

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point")!,
})

const generateClassName = createGenerateClassName()

const container = document.getElementById("app")
if (container) {
  render(
    <BrowserRouter>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <App />
      </JssProvider>
    </BrowserRouter>,
    container,
  )
}
