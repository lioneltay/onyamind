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
}
const openSnackbar = ({
  text,
  actions = [],
  duration = 5000,
  closable = false,
  onClose,
}: OpenSnackbarInput) => {
  return {
    type: "OPEN_SNACKBAR",
    payload: {
      text,
      actions,
      closable,
      onClose,
      duration,
    },
  } as const
}

const closeSnackbar = () => ({ type: "CLOSE_SNACKBAR" } as const)

export const actionCreators = {
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
