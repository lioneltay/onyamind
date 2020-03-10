import { createReducer } from "lib/rxstate"
import { state_s } from "services/state"

import { State } from "services/state/modules/list-view"

import { from } from "rxjs"
import { switchMap, map, withLatestFrom } from "rxjs/operators"

import {
  addTaskList,
  deleteTaskList,
  createDefaultTaskList,
} from "services/state/modules/task-lists"

const task_lists_s = state_s.pipe(map(state => state.task_lists))

export const reducer_s = createReducer<State>(
  createDefaultTaskList.pipe(
    switchMap(res => from(res)),
    map(list => (state: State) => {
      return {
        ...state,
        selected_task_list_id: list.id,
      }
    }),
  ),

  deleteTaskList.pipe(
    switchMap(res => from(res)),
    withLatestFrom(task_lists_s),
    map(([deleted_list_id, task_lists]) => (state: State) => {
      const { selected_task_list_id } = state

      if (deleted_list_id !== selected_task_list_id || !task_lists) {
        return state
      }

      const primary_list = task_lists.find(list => list.primary)

      return {
        ...state,
        selected_task_list_id: primary_list ? primary_list.id : null,
      }
    }),
  ),

  addTaskList.pipe(
    switchMap(val => from(val)),
    map(list => (state: State) => ({
      ...state,
      selected_task_list_id: list.id,
    })),
  ),
)
