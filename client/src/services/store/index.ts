import { createStore, applyMiddleware, combineReducers } from "redux"

import {
  reducer as listPageReducer,
  State as ListPageState,
} from "./listPage/reducer"
import { reducer as authReducer, State as AuthState } from "./auth/reducer"
import { reducer as uiReducer, State as UIState } from "./ui/reducer"

import { rootEpic as listPageEpic } from "./listPage/epics"
import { rootEpic as authEpic } from "./auth/epics"
import { rootEpic as uiEpic } from "./ui/epics"
import { createEpicMiddleware, combineEpics } from "redux-observable"
import thunkMiddleware from "redux-thunk"

export type State = {
  listPage: ListPageState
  auth: AuthState
  ui: UIState
}

const rootEpic = combineEpics(listPageEpic, authEpic, uiEpic)

const reducer = combineReducers({
  listPage: listPageReducer,
  ui: uiReducer,
  auth: authReducer,
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
