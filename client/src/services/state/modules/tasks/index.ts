import { createReducer } from "lib/rxstate"
import { State as AppState } from "services/state"
import { createDispatcher } from "services/state/tools"

import { firestore, dataWithId } from "services/firebase"

import * as api from "services/api"
import { selectTaskList } from "../misc"

import { Observable, merge, of, timer, from } from "rxjs"
import {
  switchMap,
  map,
  distinctUntilChanged,
  takeUntil,
  mergeMap,
  take,
} from "rxjs/operators"

import { openUndo, undo, closeUndo } from "services/state/modules/misc"

import { uniq, omit } from "ramda"

export const addTask = createDispatcher((title: string) => async state =>
  api.addTask({
    list_id: state.selected_task_list_id,
    notes: "",
    title,
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
  ({ task_id, list_id }: MoveTaskToListInput) => {
    return api.editTask({ task_id, task_data: { list_id } })
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

export const tasks_s = selectTaskList.pipe(
  distinctUntilChanged(),
  switchMap(list_id => createCurrentTasksStream(list_id)),
)

export const reducer_s = createReducer<AppState>(
  archiveTask.pipe(
    mergeMap(task_id => {
      const commit_s = merge(timer(7000), openUndo.stream, closeUndo.stream)
      const revert_s = undo.stream

      const addDeleteMarkerReducer = (state: AppState) => ({
        ...state,
        task_delete_markers: {
          ...state.task_delete_markers,
          [task_id]: task_id,
        },
      })

      const removeDeleteMarkerReducer = (state: AppState) => ({
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

      const addDeleteMarkersReducer = (state: AppState) => ({
        ...state,
        task_delete_markers: task_ids.reduce((markers, id) => {
          markers[id] = id
          return markers
        }, state.task_delete_markers),
      })

      const removeDeleteMarkersReducer = (state: AppState) => ({
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

  tasks_s.pipe(map(tasks => (state: AppState) => ({ ...state, tasks }))),
)
