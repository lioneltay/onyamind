import React from "react"
import { render } from "react-dom"

import App from "./App"
import { BrowserRouter } from "react-router-dom"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("SW registered: ", registration)
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

const container = document.getElementById("app")
if (container) {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    container
  )
}
