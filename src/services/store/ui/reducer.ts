import React from "react"
import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type SnackbarAction = {
  label: string
  handler?: () => void
}

export type State = {
  showDrawer: boolean
  snackbar: null | {
    icon?: React.ReactNode
    duration: number
    text: string
    actions: SnackbarAction[]
    closable: boolean
    onClose?: () => void
  }
}

const initialState: State = {
  showDrawer: false,
  snackbar: null,
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
    case "CLOSE_SNACKBAR": {
      return {
        ...state,
        snackbar: null,
      }
    }
    case "OPEN_SNACKBAR": {
      const {
        text,
        closable,
        actions,
        onClose,
        duration,
        icon,
      } = action.payload

      return {
        ...state,
        snackbar: {
          actions,
          closable,
          text,
          onClose,
          duration,
          icon,
        },
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
