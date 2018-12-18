import React from "react"
import { hot } from "react-hot-loader"

import Root from "pages"
import GlobalStyles from "css/global"

class App extends React.Component {
  render() {
    return (
      <>
        <GlobalStyles />

        <div>
          <Root />
        </div>
      </>
    )
  }
}

export default hot(module)(App)
