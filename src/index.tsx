// Add typescript support for the styled-components css prop (https://www.styled-components.com/docs/api#css-prop)
/// <reference types="styled-components/cssprop" />
import "core-js/stable"
import "regenerator-runtime/runtime"

import React from "react"
import { render } from "react-dom"

import "services/firebase"
import App from "./App"

import { initializeErrorReporting } from "services/analytics/error-reporting"
import { logEvent } from "services/analytics/events"

logEvent("APP_LOADED", { time: performance.now() })
initializeErrorReporting()

if (process.env.NODE_ENV !== "test" && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service.worker.js",
      )

      logEvent("SERVICE_WORKER_REGISTRATION|SUCCESS")
      return registration
    } catch (e) {
      logEvent("SERVICE_WORKER_REGISTRATION|FAILURE")
    }
  })
}

const container = document.getElementById("app")
if (container) {
  render(<App />, container)
}
