import { createReducer, createDispatcher } from "lib/rxstate"
import { ID, Task, TaskList } from "types"
import { firestore, dataWithId } from "services/firebase"

import { Observable, of, merge } from "rxjs"
import { map, switchMap } from "rxjs/operators"

import { user$ } from "./auth"
import { State } from "services/state"

const createCurrentListsStream = (user_id: ID | null) =>
  new Observable<TaskList[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("task_lists")
      .where("user_id", "==", user_id)
      .onSnapshot(snapshot => {
        const lists: TaskList[] = snapshot.docs.map(dataWithId) as TaskList[]
        observer.next(lists)
      })
  })

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

const list$ = user$.pipe(
  switchMap(user => createCurrentListsStream(user ? user.uid : null)),
)

export const toggleDrawer = createDispatcher()
export const setTouchEnabled = createDispatcher((enabled: boolean) => enabled)
export const selectTaskList = createDispatcher(
  (task_list_id: ID) => task_list_id,
)

export const reducer_s = createReducer<State>([
  setTouchEnabled.pipe(
    map(touch_screen => (state: State) => ({ ...state, touch_screen })),
  ),

  list$.pipe(map(task_lists => (state: State) => ({ ...state, task_lists }))),

  toggleDrawer.pipe(
    map(() => (state: State) => ({
      ...state,
      show_drawer: !state.show_drawer,
    })),
  ),

  selectTaskList.pipe(
    switchMap(selected_task_list_id => {
      const tasks$ = createCurrentTasksStream(selected_task_list_id)

      return merge(
        of((state: State) => ({ ...state, selected_task_list_id })),
        tasks$.pipe(map(tasks => (state: State) => ({ ...state, tasks }))),
      )
    }),
  ),
])
