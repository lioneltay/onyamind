import { createReducer } from "lib/rxstate"
import { State } from "services/state"
import { createDispatcher, state_s } from "services/state/tools"
import { firestore, dataWithId } from "services/firebase"
import { map, switchMap, withLatestFrom } from "rxjs/operators"
import { from, of, Observable } from "rxjs"

import { user_s } from "services/state/modules/auth"
import { tasks_s } from "services/state/modules/tasks"
import * as api from "services/api"
import { selectTaskList } from "../misc"

// export const addTaskList = createDispatcher(api.addTaskList)
export const addTaskList = createDispatcher(
  ({ name, primary }: { name: string; primary: boolean }) => async (
    state: State,
  ) => {
    const list = await api.addTaskList({
      name,
      primary,
      user_id: state.user ? state.user.uid : null,
    })

    if (list.primary) {
      await api.setPrimaryTaskList({
        user_id: list.user_id,
        task_list_id: list.id,
      })
    }

    return list
  },
)

export const removeTaskList = createDispatcher(api.removeTaskList)

export const editTaskList = createDispatcher(api.editTaskList)

export const createDefaultTaskList = createDispatcher(api.createDefaultTaskList)

export const getTaskLists = createDispatcher(api.getTaskLists)

export const setPrimaryTaskList = createDispatcher(api.setPrimaryTaskList)

user_s.subscribe(user => {
  getTaskLists(user ? user.uid : null)
})

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

const lists_s = user_s.pipe(
  switchMap(user => createCurrentListsStream(user ? user.uid : null)),
)

tasks_s.pipe(withLatestFrom(state_s)).subscribe(([tasks, state]) => {
  const { task_lists, selected_task_list_id } = state

  if (!task_lists || !selected_task_list_id || !tasks) {
    return
  }

  const selected_list = task_lists.find(
    list => list.id === selected_task_list_id,
  )

  if (!selected_list) {
    return
  }

  const non_archived_tasks = tasks.filter(task => !task.archived)

  const number_of_incomplete_tasks = non_archived_tasks.filter(
    task => !task.complete,
  ).length
  const number_of_complete_tasks = non_archived_tasks.filter(
    task => task.complete,
  ).length

  editTaskList({
    list_id: selected_task_list_id,
    list_data: {
      number_of_complete_tasks,
      number_of_incomplete_tasks,
    },
  })
})

export const reducer_s = createReducer<State>(
  lists_s.pipe(map(task_lists => (state: State) => ({ ...state, task_lists }))),

  getTaskLists.pipe(
    switchMap(lists => from(lists)),
    withLatestFrom(user_s),
    switchMap(([lists, user]) => {
      const primary = lists.find(list => list.primary)
      if (primary) {
        return of(null)
      }

      return from(
        createDefaultTaskList(user ? user.uid : null).then(list =>
          selectTaskList(list.id),
        ),
      )
    }),
    map(() => (state: State) => state),
  ),

  addTaskList.pipe(
    switchMap(val => from(val)),
    map(list => (state: State) => ({
      ...state,
      selected_task_list_id: list.id,
    })),
  ),
)
