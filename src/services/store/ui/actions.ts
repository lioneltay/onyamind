import React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"

import { SnackbarAction } from "./reducer"

const openDrawer = () => ({ type: "OPEN_DRAWER" } as const)
const closeDrawer = () => ({ type: "CLOSE_DRAWER" } as const)
const toggleDrawer = () => ({ type: "TOGGLE_DRAWER" } as const)

type OpenSnackbarInput = {
  text: string
  actions?: SnackbarAction[]
  duration?: number
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode
}
const openSnackbar = ({
  text,
  actions = [],
  duration = 5000,
  closable = false,
  onClose,
  icon,
}: OpenSnackbarInput) => {
  return {
    type: "OPEN_SNACKBAR",
    payload: {
      text,
      actions,
      closable,
      onClose,
      duration,
      icon,
    },
  } as const
}

const closeSnackbar = () => ({ type: "CLOSE_SNACKBAR" } as const)

const openFeedbackModal = () => ({ type: "OPEN_FEEDBACK_MODAL" } as const)
const closeFeedbackModal = () => ({ type: "CLOSE_FEEDBACK_MODAL" } as const)

const openAuthModal = () => ({ type: "OPEN_AUTH_MODAL" } as const)
const closeAuthModal = () => ({ type: "CLOSE_AUTH_MODAL" } as const)

export const actionCreators = {
  openAuthModal,
  closeAuthModal,

  openFeedbackModal,
  closeFeedbackModal,

  openDrawer,
  closeDrawer,
  toggleDrawer,

  openSnackbar,
  closeSnackbar,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionTypesUnion<typeof actionCreators>

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}
