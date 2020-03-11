import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type State = {}

const initialState: State = {}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    default: {
      assertNever(action)
      return state
    }
  }
}
