import { combineReducers } from "redux"

import {
  reducer as listPageReducer,
  State as ListPageState,
} from "./listPage/reducer"
import {
  reducer as trashPageReducer,
  State as TrashPageState,
} from "./trashPage/reducer"
import { reducer as authReducer, State as AuthState } from "./auth/reducer"
import { reducer as uiReducer, State as UIState } from "./ui/reducer"
import {
  reducer as settingsReducer,
  State as SettingsState,
} from "./settings/reducer"

export type State = {
  settings: SettingsState
  listPage: ListPageState
  trashPage: TrashPageState
  auth: AuthState
  ui: UIState
}

export type GetState = () => State

export const reducer = combineReducers({
  settings: settingsReducer,
  listPage: listPageReducer,
  trashPage: trashPageReducer,
  ui: uiReducer,
  auth: authReducer,
})
