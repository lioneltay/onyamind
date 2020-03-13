import { Action } from "./actions"

export type State = {
  darkMode: boolean
}

const initialState = {
  darkMode: window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : true,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_DARK_MODE": {
      return {
        ...state,
        darkMode: action.payload.darkMode,
      }
    }
    case "TOGGLE_DARK_MODE": {
      return {
        ...state,
        darkMode: !state.darkMode,
      }
    }
    default: {
      return state
    }
  }
}
