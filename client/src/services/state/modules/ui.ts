import { createReducer } from "lib/rxstate"
import { createDispatcher, state_s } from "services/state"

import { map, distinctUntilChanged } from "rxjs/operators"

import { user_s } from "./user"

export type State = {
  touch_screen: boolean
  show_drawer: boolean
  show_warning_footer: boolean
  show_undo: boolean
}

export const initial_state = {
  show_undo: false,
  touch_screen: false,
  show_drawer: false,
  show_warning_footer: false,
}

export const toggleDrawer = createDispatcher()
export const setTouchEnabled = createDispatcher((enabled: boolean) => enabled)

export const openUndo = createDispatcher()
export const closeUndo = createDispatcher()
export const undo = createDispatcher()

const openWarningFooter = createDispatcher()
const closeWarningFooter = createDispatcher()
export const toggleWarningFooter = createDispatcher()
export const showWarningFooter = createDispatcher((show: boolean) => show)

const selected_task_list_s = state_s.pipe(
  map(state => state.list_view.selected_task_list_id),
  distinctUntilChanged(),
)

export const reducer_s = createReducer<State>(
  selected_task_list_s.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: false,
    })),
  ),

  openUndo.pipe(map(() => (state: State) => ({ ...state, show_undo: true }))),
  closeUndo.pipe(map(() => (state: State) => ({ ...state, show_undo: false }))),
  undo.pipe(map(() => (state: State) => ({ ...state, show_undo: false }))),

  setTouchEnabled.pipe(
    map(touch_screen => (state: State) => ({ ...state, touch_screen })),
  ),

  toggleDrawer.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: !state.show_drawer,
    })),
  ),

  user_s.pipe(
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
)
