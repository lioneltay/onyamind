import { createStore, applyMiddleware, compose } from "redux"
import { createEpicMiddleware } from "redux-observable"
import thunkMiddleware from "redux-thunk"

import { reducer } from "./reducer"

import { rootEpic } from "./epics"

export const configureStore = () => {
  const epicMiddleware = createEpicMiddleware()

  // TODO Only use this in development
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(epicMiddleware, thunkMiddleware)),
  )

  epicMiddleware.run(rootEpic as any)

  return store
}

export const store = configureStore()

export { Dispatch } from "redux"

export { useActions, Action } from "./actions"

export { useSelector } from "./selectors"

export { State, GetState } from "./reducer"
