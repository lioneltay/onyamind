import { createReducer } from "lib/rxstate"
import { State as AppState } from "services/state"
import { createDispatcher } from "services/state/tools"

import { Observable, merge, of, timer, from } from "rxjs"
import {
  switchMap,
  map,
  distinctUntilChanged,
  takeUntil,
  mergeMap,
  take,
} from "rxjs/operators"
import { uniq, difference, omit } from "ramda"
import { openUndo, undo, closeUndo } from "services/state/modules/misc"
import { archiveTasks } from "services/state/modules/tasks"

import * as api from "services/api"

export const stopEditing = createDispatcher()
export const toggleTaskSelection = createDispatcher((id: ID) => id)
export const selectAllIncompleteTasks = createDispatcher()
export const deselectAllIncompleteTasks = createDispatcher()

export const checkSelectedTasks = createDispatcher(() => (state: AppState) =>
  api.checkTasks(state.selected_task_ids),
)
export const uncheckSelectedTasks = createDispatcher(() => (state: AppState) =>
  api.uncheckTasks(state.selected_task_ids),
)
export const uncheckCompletedTasks = createDispatcher(
  () => (state: AppState) => {
    if (!state.tasks) {
      throw Error("No Tasks")
    }
    const completed_tasks_ids = state.tasks
      .filter(task => task.complete)
      .map(task => task.id)
    return api.uncheckTasks(completed_tasks_ids)
  },
)

export const moveTasksToList = createDispatcher(
  (list_id: ID) => async state => {
    const state_tasks = state.tasks
    if (!state_tasks || !state.task_lists) {
      throw Error("Invalid State")
    }

    const list = state.task_lists.find(list => list.id === list_id) as TaskList
    const tasks = state.selected_task_ids.map(task_id =>
      (state.tasks as Task[]).find(task => task.id === task_id),
    ) as Task[]

    await Promise.all([
      api.editTasks({
        task_ids: state.selected_task_ids,
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

export const archiveSelectedTasks = createDispatcher(
  () => (state: AppState) => {
    archiveTasks(state.selected_task_ids)
  },
)

export const archiveCompletedTasks = createDispatcher(
  () => async (state: AppState) => {
    if (!state.tasks) {
      throw Error("No Tasks")
    }
    const completed_tasks_ids = state.tasks
      .filter(task => task.complete)
      .map(task => task.id)

    archiveTasks(completed_tasks_ids)
  },
)

export const reducer_s = createReducer<AppState>(
  merge(
    stopEditing.stream,
    checkSelectedTasks.stream,
    uncheckSelectedTasks.stream,
    archiveSelectedTasks.stream,
    moveTasksToList.stream,
  ).pipe(
    map(() => (state: AppState) => ({
      ...state,
      editing: false,
      selected_task_ids: [],
    })),
  ),

  toggleTaskSelection.pipe(
    map(task_id => (state: AppState) => {
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
    map(() => (state: AppState) => {
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
    map(() => (state: AppState) => {
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
