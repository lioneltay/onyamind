import * as selectors from "./selectors"
import { State } from "./reducer"
import { useSelector as originalUseSelector, shallowEqual } from "react-redux"

export const useSelector = <T extends any>(
  selector: (state: State, selectorsObj: typeof selectors) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  return originalUseSelector(
    (state: State) => selector(state, selectors),
    equalityFn || shallowEqual,
  )
}

export * from "./actions"
export * from "./reducer"
