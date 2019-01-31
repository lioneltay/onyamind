import { createReducer } from "lib/rxstate"
import { createDispatcher } from "services/state/tools"
import { State as AppState } from "services/state"

import { dataWithId, firestore } from "services/firebase"
import { Observable, merge } from "rxjs"
import { switchMap, map } from "rxjs/operators"

import { user_s } from "services/state/modules/auth"

import * as api from "services/api"

export type State = {
  tasks: Task[] | null
  selected_task_ids: ID[]
}

export const initial_state: State = {
  tasks: null,
  selected_task_ids: [],
}

export const toggleTaskSelection = createDispatcher((task_id: ID) => task_id)

export const clearTaskSelection = createDispatcher()

export const deleteSelectedTasks = createDispatcher(() => (state: AppState) =>
  api.deleteTasks(state.trash.selected_task_ids),
)

export const emptyTrash = createDispatcher(
  () => ({ trash: { tasks } }: AppState) =>
    api.deleteTasks(tasks ? tasks.map(task => task.id) : []),
)

const createArchivedTasksStream = (user_id: ID | null) =>
  new Observable<Task[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("tasks")
      .where("user_id", "==", user_id)
      .where("archived", "==", true)
      .onSnapshot(snapshot => {
        const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
        observer.next(tasks)
      })
  })

const archived_tasks_s = user_s.pipe(
  switchMap(user => createArchivedTasksStream(user ? user.uid : null)),
)

export const reducer_s = createReducer<State>(
  archived_tasks_s.pipe(
    map(tasks => (state: State) => ({
      ...state,
      tasks,
    })),
  ),

  merge(clearTaskSelection.stream, deleteSelectedTasks.stream).pipe(
    map(() => (state: State) => ({ ...state, selected_task_ids: [] })),
  ),

  toggleTaskSelection.pipe(
    map(task_id => (state: State) => {
      console.log(state.selected_task_ids.includes(task_id))

      if (state.selected_task_ids.includes(task_id)) {
        return {
          ...state,
          selected_task_ids: state.selected_task_ids.filter(
            id => id !== task_id,
          ),
        }
      }

      return {
        ...state,
        selected_task_ids: [...state.selected_task_ids, task_id],
      }
    }),
  ),
)
