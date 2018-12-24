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

let deferredPrompt

window.addEventListener("beforeinstallprompt", e => {
  console.log("BEFORE INSTALL PROMPT")
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  deferredPrompt = e

  e.prompt()
})

const container = document.getElementById("app")
if (container) {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    container,
  )
}
