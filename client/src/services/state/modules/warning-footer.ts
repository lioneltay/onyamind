import { createReducer } from "lib/rxstate"
import { map } from "rxjs/operators"

import { State } from ".."
import { createDispatcher } from "services/state/tools"

import { user$ } from "./auth"

const openWarningFooter = createDispatcher()
const closeWarningFooter = createDispatcher()
export const toggleWarningFooter = createDispatcher()
export const showWarningFooter = createDispatcher((show: boolean) => show)

export const reducer_s = createReducer<State>([
  user$.pipe(
    map(user => (state: State) => ({
      ...state,
      show_warning_footer: !user,
    })),
  ),

  openWarningFooter.pipe(
    map(() => (state: State) => ({ ...state, show_warning_footer: true })),
  ),

  closeWarningFooter.pipe(
    map(() => (state: State) => ({ ...state, show_warning_footer: false })),
  ),

  toggleWarningFooter.pipe(
    map(() => (state: State) => ({
      ...state,
      show_warning_footer: !state.show_warning_footer,
    })),
  ),

  showWarningFooter.pipe(
    map(show_warning_footer => (state: State) => ({
      ...state,
      show_warning_footer,
    })),
  ),
])
