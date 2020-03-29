import { combineEpics } from "redux-observable"

import { rootEpic as authEpic } from "./auth/epics"
import { rootEpic as uiEpic } from "./ui/epics"
import { rootEpic as settingsEpic } from "./settings/epics"

export const rootEpic = combineEpics(authEpic, uiEpic, settingsEpic)
