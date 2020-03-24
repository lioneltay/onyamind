// Add typescript support for the styled-components css prop (https://www.styled-components.com/docs/api#css-prop)
/// <reference types="styled-components/cssprop" />
import "core-js/stable"
import "regenerator-runtime/runtime"

import React from "react"
import { render } from "react-dom"

import "services/firebase"
import App from "./App"

import "./service-worker/service.worker"

import { registerServiceWorker } from "services/notifications"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service.worker.js",
      )

      registerServiceWorker(registration)

      console.log("SW registered: ", registration)
      return registration
    } catch (e) {
      console.log("SW registration failed: ", e)
    }
  })
}

const container = document.getElementById("app")
if (container) {
  render(<App />, container)
}
