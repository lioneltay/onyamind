import { createReducer } from "lib/rxstate"
import { State } from "services/state/modules/list-view"
import { createDispatcher } from "services/state"

import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { uniq, difference } from "ramda"
import { archiveTasks } from "services/state/modules/list-view"

import * as api from "services/api"

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

export const moveTasksToList = createDispatcher(
  (list_id: ID) => async state => {
    const state_tasks = state.list_view.tasks
    if (!state_tasks || !state.task_lists) {
      throw Error("Invalid State")
    }

    const list = state.task_lists.find(list => list.id === list_id) as TaskList
    const tasks = state.list_view.selected_task_ids.map(task_id =>
      (state.list_view.tasks as Task[]).find(task => task.id === task_id),
    ) as Task[]

    await Promise.all([
      api.editTasks({
        task_ids: state.list_view.selected_task_ids,
        task_data: { list_id },
      }),

      api.editTaskList({
        list_id,
        list_data: {
          number_of_complete_tasks:
            list.number_of_complete_tasks +
            tasks.filter(task => task.complete).length,
          number_of_incomplete_tasks:
            list.number_of_incomplete_tasks +
            tasks.filter(task => !task.complete).length,
        },
      }),
    ])
  },
)

export const archiveSelectedTasks = createDispatcher(() => (state: State) => {
  archiveTasks(state.selected_task_ids)
})

export const archiveCompletedTasks = createDispatcher(
  () => async (state: State) => {
    if (!state.tasks) {
      throw Error("No Tasks")
    }
    const completed_tasks_ids = state.tasks
      .filter(task => task.complete)
      .map(task => task.id)

    archiveTasks(completed_tasks_ids)
  },
)

export const reducer_s = createReducer<State>(
  merge(
    stopEditing.stream,
    checkSelectedTasks.stream,
    uncheckSelectedTasks.stream,
    archiveSelectedTasks.stream,
    moveTasksToList.stream,
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
