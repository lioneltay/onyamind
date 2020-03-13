import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"

const toggleDarkMode = () => ({ type: "TOGGLE_DARK_MODE" } as const)
const setDarkMode = (darkMode: boolean) =>
  ({ type: "SET_DARK_MODE", payload: { darkMode } } as const)

export const actionCreators = {
  toggleDarkMode,
  setDarkMode,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionsUnion<typeof actionCreators>
