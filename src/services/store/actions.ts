import React from "react"
import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import { mapObjIndexed } from "ramda"

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
import {
  actionCreators as trashPageActionCreators,
  Action as TrashPageAction,
} from "./trashPage/actions"
import {
  actionCreators as appActionCreators,
  Action as AppAction,
} from "./app/actions"

export type Action =
  | ListPageAction
  | TrashPageAction
  | UIAction
  | AuthAction
  | SettingsAction
  | AppAction

export const actionCreators = {
  app: appActionCreators,
  settings: settingsActionCreators,
  listPage: listPageActionCreators,
  trashPage: trashPageActionCreators,
  ui: uiActionCreators,
  auth: authActionCreators,
} as const

export function useActions<K extends keyof typeof actionCreators>(
  slice: K,
): typeof actionCreators[K]
export function useActions(): typeof actionCreators
export function useActions(slice?: keyof typeof actionCreators) {
  const dispatch = useDispatch()

  return React.useMemo(() => {
    return slice
      ? bindActionCreators(actionCreators[slice], dispatch)
      : mapObjIndexed(
          value => bindActionCreators(value, dispatch),
          actionCreators,
        )
  }, [])
}
