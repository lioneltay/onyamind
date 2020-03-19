import { SETTINGS_LOCAL_STORAGE_KEY } from "config"

type LocalSettings = {
  darkMode: boolean
}

export function getLocalSettings(): LocalSettings | null {
  try {
    const val = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY)
    return val ? JSON.parse(val) : null
  } catch (e) {
    return null
  }
}

export function setLocalSettings(settings: LocalSettings) {
  localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings))
}
