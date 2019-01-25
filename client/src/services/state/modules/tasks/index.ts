import { createReducer } from "lib/rxstate"
import { State } from "services/state"
import { createDispatcher } from "services/state/tools"

import { firestore, dataWithId } from "services/firebase"

import { updateCurrentTaskListTaskCount } from "../task-lists"
import * as api from "./api"
import { selectTaskList } from "../misc"

import { Observable } from "rxjs"
import { switchMap, map } from "rxjs/operators"

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

export const removeTask = createDispatcher(task_id => async (state: State) => {
  await api.removeTask(task_id)
  await updateCurrentTaskListTaskCount()
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
  switchMap(list_id => createCurrentTasksStream(list_id)),
)

export const reducer_s = createReducer<State>([
  tasks_s.pipe(map(tasks => (state: State) => ({ ...state, tasks }))),
])
