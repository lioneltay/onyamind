import { createReducer } from "lib/rxstate"
import { State } from "services/state/modules/list-view"
import { createDispatcher, state_s } from "services/state"

import { firestore, dataWithId } from "services/firebase"

import * as api from "services/api"

import { Observable, merge, of, timer, from } from "rxjs"
import {
  switchMap,
  map,
  distinctUntilChanged,
  takeUntil,
  mergeMap,
  take,
} from "rxjs/operators"

import { openUndo, undo, closeUndo } from "services/state/modules/ui"

import { uniq, omit } from "ramda"

type AddTaskInput = {
  title: string
  notes?: string
}

export const addTask = createDispatcher((input: AddTaskInput) => async state =>
  api.addTask({
    list_id: state.list_view.selected_task_list_id,
    notes: input.notes || "",
    title: input.title,
    user_id: state.user ? state.user.uid : null,
  }),
)

export const archiveTask = createDispatcher((task_id: ID) => {
  openUndo()
  return task_id
})

export const archiveTasks = createDispatcher((task_ids: ID[]) => {
  openUndo()
  return task_ids
})

type MoveTaskToListInput = {
  task_id: ID
  list_id: ID
}
export const moveTaskToList = createDispatcher(
  ({ task_id, list_id }: MoveTaskToListInput) => async state => {
    if (!state.list_view.tasks || !state.task_lists) {
      throw Error("Invalid State")
    }

    const list = state.task_lists.find(list => list.id === list_id)
    const task = state.list_view.tasks.find(task => task.id === task_id)

    if (!task || !list) {
      throw Error("Invalid State 2")
    }

    await Promise.all([
      api.editTask({ task_id, task_data: { list_id } }),

      api.editTaskList({
        list_id,
        list_data: task.complete
          ? { number_of_complete_tasks: list.number_of_complete_tasks + 1 }
          : { number_of_incomplete_tasks: list.number_of_incomplete_tasks + 1 },
      }),
    ])
  },
)

export const deleteTask = createDispatcher(api.deleteTask)

export const editTask = createDispatcher(api.editTask)

const createCurrentTasksStream = (list_id: ID | null) =>
  list_id
    ? new Observable<Task[] | null>(observer => {
        observer.next(null)
        return firestore
          .collection("tasks")
          .where("list_id", "==", list_id)
          .where("archived", "==", false)
          .onSnapshot(snapshot => {
            const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
            observer.next(tasks)
          })
      })
    : of(null)

const selected_task_list_s = state_s.pipe(
  map(state => state.list_view.selected_task_list_id),
  distinctUntilChanged(),
)

export const tasks_s = selected_task_list_s.pipe(
  distinctUntilChanged(),
  switchMap(list_id => createCurrentTasksStream(list_id)),
)

export const reducer_s = createReducer<State>(
  tasks_s.pipe(map(tasks => (state: State) => ({ ...state, tasks }))),

  archiveTask.pipe(
    mergeMap(task_id => {
      const commit_s = merge(timer(7000), openUndo.stream, closeUndo.stream)
      const revert_s = undo.stream

      const addDeleteMarkerReducer = (state: State) => ({
        ...state,
        task_delete_markers: {
          ...state.task_delete_markers,
          [task_id]: task_id,
        },
      })

      const removeDeleteMarkerReducer = (state: State) => ({
        ...state,
        task_delete_markers: omit([task_id], state.task_delete_markers),
      })

      const archiveTask = () => from(api.archiveTask(task_id))

      return merge(
        of(addDeleteMarkerReducer),
        merge(
          revert_s,
          commit_s.pipe(
            take(1),
            switchMap(archiveTask),
            takeUntil(revert_s),
          ),
        ).pipe(
          take(1),
          map(() => removeDeleteMarkerReducer),
        ),
      )
    }),
  ),

  archiveTasks.pipe(
    mergeMap(task_ids => {
      const commit_s = merge(timer(7000), openUndo.stream, closeUndo.stream)
      const revert_s = undo.stream

      const addDeleteMarkersReducer = (state: State) => ({
        ...state,
        task_delete_markers: task_ids.reduce((markers, id) => {
          markers[id] = id
          return markers
        }, state.task_delete_markers),
      })

      const removeDeleteMarkersReducer = (state: State) => ({
        ...state,
        task_delete_markers: omit(task_ids, state.task_delete_markers),
      })

      const archiveTasks = () => from(api.archiveTasks(task_ids))

      return merge(
        of(addDeleteMarkersReducer),
        merge(
          revert_s,
          commit_s.pipe(
            take(1),
            switchMap(archiveTasks),
            takeUntil(revert_s),
          ),
        ).pipe(
          take(1),
          map(() => removeDeleteMarkersReducer),
        ),
      )
    }),
  ),
)
