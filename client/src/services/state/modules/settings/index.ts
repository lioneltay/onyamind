import { createReducer } from "lib/rxstate"
import { createDispatcher } from "services/state"
import { Theme, getTheme } from "theme"

import { firestore, dataWithId } from "services/firebase"
import { map, switchMap } from "rxjs/operators"
import { Observable } from "rxjs"

import { State as AppState } from "services/state"
import { user_s } from "services/state/modules/user"

import * as api from "services/api"

export type State = {
  theme: Theme
  user_settings: Omit<Settings, "id" | "user_id" | "created_at" | "updated_at">
}

export const initial_state: State = {
  theme: getTheme({ dark: false }),
  user_settings: {
    dark: false,
  },
}

export const toggleDarkMode = createDispatcher(() => (state: AppState) => {
  api.updateSettings(state.user ? state.user.uid : null, {
    dark: !state.settings.user_settings.dark,
  })
})

const createSettingsStream = (user_id: ID | null) =>
  new Observable<Settings>(observer => {
    return firestore
      .collection("settings")
      .where("user_id", "==", user_id)
      .limit(1)
      .onSnapshot(async snapshot => {
        const [settings] = snapshot.docs.map(dataWithId) as Settings[]
        if (settings) {
          return observer.next(settings)
        }
        observer.next(await api.createSettings(user_id))
      })
  })

const settings_s = user_s.pipe(
  switchMap(user => createSettingsStream(user ? user.uid : null)),
)

export const reducer_s = createReducer<State>(
  settings_s.pipe(
    map(settings => (state: State) => ({
      ...state,
      user_settings: settings,
      theme: getTheme({ dark: settings.dark }),
    })),
  ),
)
