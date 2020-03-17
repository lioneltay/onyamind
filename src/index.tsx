// Add typescript support for the styled-components css prop (https://www.styled-components.com/docs/api#css-prop)
/// <reference types="styled-components/cssprop" />
import "core-js/stable"
import "regenerator-runtime/runtime"

import React from "react"
import { render } from "react-dom"

import App from "./App"

import "./service-worker/service.worker"

console.log('weladjfk')

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

function watchForHover() {
  var hasHoverClass = false
  var container = document.body
  var lastTouchTime = 0

  function enableHover() {
    // filter emulated events coming from touch events
    if (Date.now() - lastTouchTime < 500) return
    if (hasHoverClass) return

    container.className += " hasHover"
    hasHoverClass = true
  }

  function disableHover() {
    if (!hasHoverClass) return

    container.className = container.className.replace(" hasHover", "")
    hasHoverClass = false
  }

  function updateLastTouchTime() {
    lastTouchTime = Date.now()
  }

  document.addEventListener("touchstart", updateLastTouchTime, true)
  document.addEventListener("touchstart", disableHover, true)
  document.addEventListener("mousemove", enableHover, true)

  enableHover()
}

watchForHover()

const container = document.getElementById("app")
if (container) {
  render(<App />, container)
}
