import { createReducer } from "lib/rxstate"
import { createDispatcher } from "services/state/tools"
import { Theme, getTheme } from "theme"

import { map } from "rxjs/operators"

export type State = {
  theme: Theme
  dark: boolean
}

export const initial_state: State = {
  theme: getTheme({ dark: true }),
  dark: true,
}

export const toggleDarkMode = createDispatcher()

export const reducer_s = createReducer<State>(
  toggleDarkMode.pipe(
    map(() => (state: State) => {
      const dark = !state.dark
      return {
        ...state,
        dark,
        theme: getTheme({ dark }),
      }
    }),
  ),
)
