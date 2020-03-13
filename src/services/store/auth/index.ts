import * as selectors from "./selectors"
import { State as StoreState } from "services/store"
import { useSelector as originalUseSelector, shallowEqual } from "react-redux"

export const useSelector = <T extends any>(
  selector: (state: StoreState, selectorsObj: typeof selectors) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  return originalUseSelector(
    (state: StoreState) => selector(state, selectors),
    equalityFn || shallowEqual,
  )
}

export * from "./actions"
export * from "./reducer"
