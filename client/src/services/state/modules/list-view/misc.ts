import { createReducer } from "lib/rxstate"
import { map, distinctUntilChanged } from "rxjs/operators"

import { State } from "services/state/modules/list-view"
import { createDispatcher, state_s } from "services/state"

export const selectTaskList = createDispatcher(
  (task_list_id: ID | null) => task_list_id,
)

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

  selectTaskList.pipe(
    map(selected_task_list_id => (state: State) => ({
      ...state,
      selected_task_list_id,
    })),
  ),
)
