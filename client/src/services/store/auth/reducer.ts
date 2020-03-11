import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type State = {
  user: User | null
}

const initialState: State = {
  user: null,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_USER": {
      action
      return {
        ...state,
        user: action.payload.user,
      }
    }
    case "SIGNIN|PENDING":
    case "SIGNIN|FAILURE":
    case "SIGNIN|SUCCESS":
    case "SIGNOUT|PENDING":
    case "SIGNOUT|FAILURE":
    case "SIGNOUT|SUCCESS": {
      return state
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
