import { createStore, applyMiddleware, combineReducers, compose } from "redux"

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

import { actionCreators as listPageActionCreators } from "./listPage/actions"
import { actionCreators as uiActionCreators } from "./ui/actions"
import { actionCreators as authActionCreators } from "./auth/actions"
import { shallowEqual } from "react-redux"
import { useDispatch, useSelector as originalUseSelector } from "react-redux"
import { bindActionCreators } from "redux"

const actionCreators = {
  ...listPageActionCreators,
  ...uiActionCreators,
  ...authActionCreators,
}

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}

import * as listPageSelectors from "./listPage/selectors"
import * as uiSelectors from "./ui/selectors"
import * as authSelectors from "./auth/selectors"

const selectors = {
  listPage: listPageSelectors,
  ui: uiSelectors,
  auth: authSelectors,
}

export const useSelector = <T extends any>(
  selector: (state: State, selectorsObj: typeof selectors) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  return originalUseSelector(
    (state: State) => selector(state, selectors),
    equalityFn || shallowEqual,
  )
}