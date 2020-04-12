import React from "react"
import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type SnackbarType = "error" | "warning" | "info" | "success"

export type State = {
  showFeedbackModal: boolean
  showAuthModal: boolean
  showDrawer: boolean
  snackbar: null | {
    type: SnackbarType
    duration: number
    text: string
    closable: boolean
  }
}

const initialState: State = {
  showFeedbackModal: false,
  showAuthModal: false,
  showDrawer: false,
  snackbar: null,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "OPEN_AUTH_MODAL": {
      return {
        ...state,
        showAuthModal: true,
      }
    }
    case "CLOSE_AUTH_MODAL": {
      return {
        ...state,
        showAuthModal: false,
      }
    }
    case "OPEN_FEEDBACK_MODAL": {
      return {
        ...state,
        showFeedbackModal: true,
      }
    }
    case "CLOSE_FEEDBACK_MODAL": {
      return {
        ...state,
        showFeedbackModal: false,
      }
    }
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
    case "CLOSE_SNACKBAR": {
      return {
        ...state,
        snackbar: null,
      }
    }
    case "OPEN_SNACKBAR": {
      return {
        ...state,
        snackbar: action.payload,
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
