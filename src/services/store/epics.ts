import { combineEpics } from "redux-observable"

import { rootEpic as listPageEpic } from "./listPage/epics"
import { rootEpic as authEpic } from "./auth/epics"
import { rootEpic as uiEpic } from "./ui/epics"
import { rootEpic as settingsEpic } from "./settings/epics"
import { rootEpic as trashPageEpic } from "./trashPage/epics"
import { rootEpic as appEpic } from "./app/epics"

export const rootEpic = combineEpics(
  appEpic,
  listPageEpic,
  authEpic,
  uiEpic,
  settingsEpic,
  trashPageEpic,
)
