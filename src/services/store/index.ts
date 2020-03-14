import { createStore, applyMiddleware, combineReducers, compose } from "redux"
import { createEpicMiddleware, combineEpics } from "redux-observable"
import thunkMiddleware from "redux-thunk"
import {
  useDispatch,
  useSelector as originalUseSelector,
  shallowEqual,
} from "react-redux"
import { bindActionCreators } from "redux"
import { selectors } from "./selectors"

import {
  reducer as listPageReducer,
  State as ListPageState,
} from "./listPage/reducer"
import { reducer as authReducer, State as AuthState } from "./auth/reducer"
import { reducer as uiReducer, State as UIState } from "./ui/reducer"
import {
  reducer as settingsReducer,
  State as SettingsState,
} from "./settings/reducer"

import { rootEpic as listPageEpic } from "./listPage/epics"
import { rootEpic as authEpic } from "./auth/epics"
import { rootEpic as uiEpic } from "./ui/epics"
import { rootEpic as settingsEpic } from "./settings/epics"

import {
  actionCreators as listPageActionCreators,
  Action as ListPageAction,
} from "./listPage/actions"
import {
  actionCreators as uiActionCreators,
  Action as UIAction,
} from "./ui/actions"
import {
  actionCreators as authActionCreators,
  Action as AuthAction,
} from "./auth/actions"
import {
  actionCreators as settingsActionCreators,
  Action as SettingsAction,
} from "./settings/actions"

export type State = {
  settings: SettingsState
  listPage: ListPageState
  auth: AuthState
  ui: UIState
}

export type GetState = () => State

const rootEpic = combineEpics(listPageEpic, authEpic, uiEpic, settingsEpic)

const reducer = combineReducers({
  settings: settingsReducer,
  listPage: listPageReducer,
  ui: uiReducer,
  auth: authReducer,
})

export type Action = ListPageAction | UIAction | AuthAction | SettingsAction

const actionCreators = {
  ...settingsActionCreators,
  ...listPageActionCreators,
  ...uiActionCreators,
  ...authActionCreators,
}

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
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
