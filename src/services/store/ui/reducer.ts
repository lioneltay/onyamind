import React from "react"
import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type SnackbarType = "error" | "warning" | "info" | "success"

export type AuthModalMode = "signin-only" | null

export type ModalAction = {
  label: string
  action: (closeModal: () => void) => void
}

export type State = {
  showFeedbackModal: boolean
  authModal: null | {
    mode: AuthModalMode
  }
  showDrawer: boolean
  snackbar: null | {
    type: SnackbarType
    duration: number
    text: string
    closable: boolean
  }
  modal: null | {
    title: string
    content: React.ReactNode
    actions?: null | ModalAction[]
  }
}

const initialState: State = {
  showFeedbackModal: false,
  authModal: null,
  showDrawer: false,
  snackbar: null,
  modal: null,
  // modal: {
  //   title: "Global Modal",
  //   content: "hello",
  //   actions: [
  //     { label: "Cancel", action: () => console.log("cancel") },
  //     { label: "Confirm", action: () => console.log("confirm") },
  //   ],
  // },
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL": {
      return {
        ...state,
        modal: action.payload,
      }
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        modal: null,
      }
    }
    case "OPEN_AUTH_MODAL": {
      return {
        ...state,
        authModal: {
          mode: action.payload.mode ?? null,
        },
      }
    }
    case "CLOSE_AUTH_MODAL": {
      return {
        ...state,
        authModal: null,
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
