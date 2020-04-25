import { useSelector as originalUseSelector, shallowEqual } from "react-redux"
import * as listPageSelectors from "./listPage/selectors"
import * as uiSelectors from "./ui/selectors"
import * as authSelectors from "./auth/selectors"
import * as appSelectors from "./app/selectors"
import { State } from "./reducer"

export const selectors = {
  listPage: listPageSelectors,
  ui: uiSelectors,
  app: appSelectors,
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
