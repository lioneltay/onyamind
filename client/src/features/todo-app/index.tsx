import React from "react"

import { Provider as DnDProvider } from "@tekktekk/react-dnd"
import { Provider } from "./state"
import Root from "./Root"

const TodoApp: React.FunctionComponent = () => {
  return (
    <DnDProvider>
      <Provider>
        <Root />
      </Provider>
    </DnDProvider>
  )
}

export default TodoApp
