import { createReducer } from "lib/rxstate"
import { map, distinctUntilChanged } from "rxjs/operators"

import { State } from "services/state"
import { createDispatcher } from "services/state/tools"
import { state_s } from "services/state/tools"

export const toggleDrawer = createDispatcher()
export const setTouchEnabled = createDispatcher((enabled: boolean) => enabled)
export const selectTaskList = createDispatcher(
  (task_list_id: ID | null) => task_list_id,
)

const selected_task_list_s = state_s.pipe(
  map(state => state.selected_task_list_id),
  distinctUntilChanged(),
)

export const openUndo = createDispatcher()
export const closeUndo = createDispatcher()
export const undo = createDispatcher()

export const reducer_s = createReducer<State>(
  openUndo.pipe(map(() => (state: State) => ({ ...state, show_undo: true }))),
  closeUndo.pipe(map(() => (state: State) => ({ ...state, show_undo: false }))),
  undo.pipe(map(() => (state: State) => ({ ...state, show_undo: false }))),

  selected_task_list_s.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: false,
    })),
  ),

  setTouchEnabled.pipe(
    map(touch_screen => (state: State) => ({ ...state, touch_screen })),
  ),

  toggleDrawer.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: !state.show_drawer,
    })),
  ),

  selectTaskList.pipe(
    map(selected_task_list_id => (state: State) => ({
      ...state,
      selected_task_list_id,
    })),
  ),
)
