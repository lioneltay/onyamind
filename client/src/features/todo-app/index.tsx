import React from "react"

import { Provider } from "./state"
import Root from "./Root"

const TodoApp: React.FunctionComponent = () => {
  return (
    <Provider>
      <Root />
    </Provider>
  )
}

export default TodoApp
