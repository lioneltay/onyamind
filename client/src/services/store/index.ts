import { createStore, applyMiddleware } from "redux"

import { reducer, State } from "./reducer"
import { useSelector as originalUseSelector, shallowEqual } from "react-redux"

import { rootEpic } from "./epics"
import { createEpicMiddleware } from "redux-observable"

import * as selectors from "./selectors"

export const configureStore = () => {
  const epicMiddleware = createEpicMiddleware()

  const store = createStore(reducer, applyMiddleware(epicMiddleware))

  epicMiddleware.run(rootEpic as any)

  return store
}

export const store = configureStore()

export const useSelector = <T extends any>(
  selector: (state: State, selectorsObj: typeof selectors) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  return originalUseSelector(
    (state: State) => selector(state, selectors),
    equalityFn || shallowEqual,
  )
}

export * from "./actions"
export * from "./reducer"
