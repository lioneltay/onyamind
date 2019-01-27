import { createReducer } from "lib/rxstate"
import { State } from "services/state"
import { createDispatcher } from "services/state/tools"

import { merge } from "rxjs"
import { map, tap } from "rxjs/operators"
import { uniq, difference } from "ramda"

import { updateCurrentTaskListTaskCount } from "../task-lists"
import * as api from "./api"

export const stopEditing = createDispatcher()
export const toggleTaskSelection = createDispatcher((id: ID) => id)
export const selectAllIncompleteTasks = createDispatcher()
export const deselectAllIncompleteTasks = createDispatcher()

export const checkSelectedTasks = createDispatcher(() => (state: State) =>
  api.checkTasks(state.selected_task_ids),
)
export const uncheckSelectedTasks = createDispatcher(() => (state: State) =>
  api.uncheckTasks(state.selected_task_ids),
)
export const uncheckCompletedTasks = createDispatcher(() => (state: State) => {
  if (!state.tasks) {
    throw Error("No Tasks")
  }
  const completed_tasks_ids = state.tasks
    .filter(task => task.complete)
    .map(task => task.id)
  return api.uncheckTasks(completed_tasks_ids)
})
export const deleteSelectedTasks = createDispatcher(
  () => async (state: State) => {
    await api.deleteTasks(state.selected_task_ids)
    await updateCurrentTaskListTaskCount()
  },
)
export const deleteCompletedTasks = createDispatcher(
  () => async (state: State) => {
    if (!state.tasks) {
      throw Error("No Tasks")
    }
    const completed_tasks_ids = state.tasks
      .filter(task => task.complete)
      .map(task => task.id)
    await api.deleteTasks(completed_tasks_ids)
    await updateCurrentTaskListTaskCount()
  },
)

export const reducer_s = createReducer<State>(
  merge(
    stopEditing.output_s,
    checkSelectedTasks.output_s,
    uncheckSelectedTasks.output_s,
    deleteSelectedTasks.output_s,
  ).pipe(
    map(() => (state: State) => ({
      ...state,
      editing: false,
      selected_task_ids: [],
    })),
  ),

  toggleTaskSelection.pipe(
    map(task_id => (state: State) => {
      const { selected_task_ids } = state

      const index = selected_task_ids.findIndex(id => id === task_id)
      const new_selected_tasks =
        index >= 0
          ? selected_task_ids.filter(id => id !== task_id)
          : [...selected_task_ids, task_id]

      return {
        ...state,
        selected_task_ids: new_selected_tasks,
        editing: new_selected_tasks.length > 0,
      }
    }),
  ),

  selectAllIncompleteTasks.pipe(
    map(() => (state: State) => {
      if (!state.tasks) {
        throw Error("No Tasks")
      }

      return {
        ...state,
        selected_task_ids: uniq(
          state.selected_task_ids.concat(
            state.tasks.filter(task => !task.complete).map(task => task.id),
          ),
        ),
      }
    }),
  ),

  deselectAllIncompleteTasks.pipe(
    map(() => (state: State) => {
      if (!state.tasks) {
        throw Error("No Tasks")
      }

      return {
        ...state,
        selected_task_ids: difference(
          state.selected_task_ids,
          state.tasks.filter(task => !task.complete).map(task => task.id),
        ),
      }
    }),
  ),
)
