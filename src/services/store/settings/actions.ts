import { ActionsUnion } from "services/store/helpers"

const toggleDarkMode = () =>
  ({ type: "TOGGLE_DARK_MODE", meta: { settingsUpdate: true } } as const)

const setDarkMode = (darkMode: boolean) =>
  ({
    type: "SET_DARK_MODE",
    meta: { settingsUpdate: true },
    payload: { darkMode },
  } as const)

const setSettings = (settings: Settings | null) =>
  ({ type: "SET_SETTINGS", payload: { settings } } as const)

export const actionCreators = {
  toggleDarkMode,
  setDarkMode,
  setSettings,
}

export type Action = ActionsUnion<typeof actionCreators>
