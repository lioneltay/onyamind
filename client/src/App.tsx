import React from "react"
import { hot } from "react-hot-loader"

import Root from "pages"
import GlobalStyles from "styles/global"

import { Provider as RxStateProvider } from "services/state"

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

class App extends React.Component {
  render() {
    return (
      <RxStateProvider>
        <GlobalStyles />
        <Root />
      </RxStateProvider>
    )
  }
}

export default hot(module)(App)
