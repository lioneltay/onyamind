import React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"

import { SnackbarType } from "./reducer"

const openDrawer = () => ({ type: "OPEN_DRAWER" } as const)
const closeDrawer = () => ({ type: "CLOSE_DRAWER" } as const)
const toggleDrawer = () => ({ type: "TOGGLE_DRAWER" } as const)

type OpenSnackbarInput = {
  text: string
  duration?: number
  closable?: boolean
  type: SnackbarType
}
const openSnackbar = ({
  text,
  duration = 5000,
  closable = false,
  type,
}: OpenSnackbarInput) => {
  return {
    type: "OPEN_SNACKBAR",
    payload: {
      text,
      closable,
      duration,
      type,
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
