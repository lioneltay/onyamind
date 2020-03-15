import { useSelector as originalUseSelector, shallowEqual } from "react-redux"
import * as listPageSelectors from "./listPage/selectors"
import * as uiSelectors from "./ui/selectors"
import * as authSelectors from "./auth/selectors"
import { State } from "./reducer"

// This works but shows an error..
type LiftSelectors<T extends Record<string, FunctionType>> = {
  //@ts-ignore
  [K in keyof T]: (...args: ModifyFirst<Parameters<T[K]>>) => ReturnType<T[K]>
}

type ModifyFirst<T extends any[]> = {
  [K in keyof T]: K extends "0" ? State : T[K]
}

import { mapObjIndexed } from "ramda"

const mapSelectors = <T extends Record<any, any>>(
  key: keyof State,
  selectors: T,
): LiftSelectors<T> => {
  return (mapObjIndexed as any)(
    (val: any) => (state: State, ...args: any[]) => val(state[key], ...args),
    selectors,
  )
}

export const selectors = {
  listPage: mapSelectors("listPage", listPageSelectors),
  ui: mapSelectors("ui", uiSelectors),
  auth: mapSelectors("auth", authSelectors),
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
