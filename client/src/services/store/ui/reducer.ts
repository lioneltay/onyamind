import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type State = {
  showDrawer: boolean
  showUndoSnackbar: boolean
  showWarningFooter: boolean
}

const initialState: State = {
  showDrawer: false,
  showUndoSnackbar: false,
  showWarningFooter: false,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "OPEN_DRAWER": {
      return {
        ...state,
        showDrawer: true,
      }
    }
    case "CLOSE_DRAWER": {
      return {
        ...state,
        showDrawer: false,
      }
    }
    case "TOGGLE_DRAWER": {
      return {
        ...state,
        showDrawer: !state.showDrawer,
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
