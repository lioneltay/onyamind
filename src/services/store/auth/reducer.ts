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
      return {
        ...state,
        // Explicitly create a new object so that any ui dependent on the user object will update
        user: action.payload.user ? { ...action.payload.user } : null,
      }
    }
    // case "SIGNIN|PENDING": {
    //   return state
    // }
    // case "SIGNIN|FAILURE": {
    //   return state
    // }
    // case "SIGNIN|SUCCESS": {
    //   return {
    //     ...state,
    //     // Explicitly create a new object so that any ui dependent on the user object will update
    //     user: { ...action.payload.user },
    //   }
    // }
    // case "SIGNOUT|PENDING": {
    //   return state
    // }
    // case "SIGNOUT|FAILURE": {
    //   return state
    // }
    // case "SIGNOUT|SUCCESS": {
    //   return state
    // }
    default: {
      return state
    }
  }
}
