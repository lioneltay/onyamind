import { createReducer } from "lib/rxstate"
import { map, distinctUntilChanged } from "rxjs/operators"

import { State } from "services/state/modules/list-view"
import { createDispatcher, state_s } from "services/state"

export const selectTaskList = createDispatcher(
  (task_list_id: ID | null) => task_list_id,
)

export const toggleEditingTask = createDispatcher((task_id: ID) => task_id)

export const stopEditingTask = createDispatcher()

export const reducer_s = createReducer<State>(
  stopEditingTask.pipe(
    map(() => (state: State) => ({
      ...state,
      editing_task_id: null,
    })),
  ),

  toggleEditingTask.pipe(
    map(task_id => (state: State) => ({
      ...state,
      editing_task_id: !state.editing
        ? task_id === state.editing_task_id
          ? null
          : task_id
        : null,
    })),
  ),

  selectTaskList.pipe(
    map(selected_task_list_id => (state: State) => ({
      ...state,
      selected_task_list_id,
    })),
  ),
)
