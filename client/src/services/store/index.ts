import { createStore, applyMiddleware, combineReducers } from "redux"

import {
  reducer as listPageReducer,
  State as ListPageState,
} from "./listPage/reducer"

import { rootEpic as listPageEpic } from "./listPage/epics"
import { createEpicMiddleware, combineEpics } from "redux-observable"
import thunkMiddleware from "redux-thunk"

export type State = {
  listPage: ListPageState
}

const rootEpic = combineEpics(listPageEpic)

const reducer = combineReducers({
  listPage: listPageReducer,
})

export const configureStore = () => {
  const epicMiddleware = createEpicMiddleware()

  const store = createStore(
    reducer,
    applyMiddleware(epicMiddleware, thunkMiddleware),
  )

  epicMiddleware.run(rootEpic as any)

  return store
}

export const store = configureStore()
