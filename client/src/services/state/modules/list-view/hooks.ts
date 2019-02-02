import { createReducer } from "lib/rxstate"
import { map } from "rxjs/operators"

import { State } from "services/state/modules/list-view"

import { from } from "rxjs"
import { switchMap } from "rxjs/operators"

import { addTaskList } from "services/state/modules/task-lists"

export const reducer_s = createReducer<State>(
  addTaskList.pipe(
    switchMap(val => from(val)),
    map(list => (state: State) => ({
      ...state,
      selected_task_list_id: list.id,
    })),
  ),
)
