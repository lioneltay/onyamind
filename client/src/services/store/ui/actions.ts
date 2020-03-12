import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"

const openDrawer = () => ({ type: "OPEN_DRAWER" } as const)
const closeDrawer = () => ({ type: "CLOSE_DRAWER" } as const)
const toggleDrawer = () => ({ type: "TOGGLE_DRAWER" } as const)

const openUndoSnackbar = () => ({ type: "OPEN_UNDO_SNACKBAR" } as const)
const closeUndoSnackbar = () => ({ type: "CLOSE_UNDO_SNACKBAR" } as const)

const Action = {
  openDrawer,
  closeDrawer,
  toggleDrawer,

  openUndoSnackbar,
  closeUndoSnackbar,
}

export const actionCreators = {
  openDrawer,
  closeDrawer,
  toggleDrawer,

  openUndoSnackbar,
  closeUndoSnackbar,
}

export type Action = ActionsUnion<typeof Action>
export type ActionType = ActionTypesUnion<typeof Action>

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}
