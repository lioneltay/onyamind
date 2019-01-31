import { createReducer } from "lib/rxstate"
import { State } from "services/state"
import { createDispatcher } from "services/state/tools"

import { firestore, dataWithId } from "services/firebase"

import { updateCurrentTaskListTaskCount } from "../task-lists"
import * as api from "./api"
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

export const addTask = createDispatcher(
  (title: string) => async (state: State) => {
    const task = await api.addTask({
      list_id: state.selected_task_list_id,
      notes: "",
      title,
      user_id: state.user ? state.user.uid : null,
    })

    await updateCurrentTaskListTaskCount()

    return task
  },
)

export const removeTask = createDispatcher(task_id => {
  openUndo()
  return task_id
})

export const editTask = createDispatcher(api.editTask)

const createCurrentTasksStream = (list_id: ID) =>
  new Observable<Task[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("tasks")
      .where("list_id", "==", list_id)
      .onSnapshot(snapshot => {
        const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
        observer.next(tasks)
      })
  })

const tasks_s = selectTaskList.pipe(
  distinctUntilChanged(),
  switchMap(list_id => createCurrentTasksStream(list_id)),
)

export const reducer_s = createReducer<State>(
  removeTask.pipe(
    mergeMap(task_id => {
      const commit_s = merge(timer(7000), openUndo.output_s, closeUndo.output_s)
      const revert_s = undo.output_s

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

      const deleteTask = () =>
        from(
          Promise.all([
            api.removeTask(task_id),
            updateCurrentTaskListTaskCount(),
          ]),
        )

      return merge(
        of(addDeleteMarkerReducer),
        merge(
          revert_s,
          commit_s.pipe(
            take(1),
            switchMap(deleteTask),
            takeUntil(revert_s),
          ),
        ).pipe(
          take(1),
          map(() => removeDeleteMarkerReducer),
        ),
      )
    }),
  ),

  tasks_s.pipe(map(tasks => (state: State) => ({ ...state, tasks }))),
)
