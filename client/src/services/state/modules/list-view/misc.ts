import { createReducer } from "lib/rxstate"
import { map, distinctUntilChanged } from "rxjs/operators"

import { State } from "services/state/modules/list-view"
import { createDispatcher, state_s } from "services/state"

export const selectTaskList = createDispatcher(
  (task_list_id: ID | null) => task_list_id,
)

export const reducer_s = createReducer<State>(
  selectTaskList.pipe(
    map(selected_task_list_id => (state: State) => ({
      ...state,
      selected_task_list_id,
    })),
  ),
)
