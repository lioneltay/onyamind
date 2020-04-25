import { combineReducers } from "redux"

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
import { reducer as appReducer, State as AppState } from "./app/reducer"

export type State = {
  app: AppState
  settings: SettingsState
  listPage: ListPageState
  auth: AuthState
  ui: UIState
}

export type GetState = () => State

export const reducer = combineReducers({
  app: appReducer,
  settings: settingsReducer,
  listPage: listPageReducer,
  ui: uiReducer,
  auth: authReducer,
})
