import { combineEpics } from "redux-observable"
import { Observable, empty } from "rxjs"
import { map, switchMap, distinctUntilChanged } from "rxjs/operators"
import { Action, actionCreators } from "../actions"
import { firestore, dataWithId } from "services/firebase"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

const createTasksObservable = (userId: ID, listId: ID) =>
  new Observable<Task[]>(observer => {
    return firestore
      .collection("task")
      .where("listId", "==", listId)
      .where("userId", "==", userId)
      .where("archived", "==", false)
      .onSnapshot(snapshot => {
        const tasks = snapshot.docs.map(doc => dataWithId(doc) as Task)
        observer.next(tasks)
      })
  })

const tasksEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => [state.auth?.user?.uid ?? null, state.app.selectedTaskListId]),
    distinctUntilChanged(
      (prev, curr) => prev[0] === curr[0] && prev[1] === curr[1],
    ),
    switchMap(([userId, listId]) => {
      return listId && userId
        ? createTasksObservable(userId, listId).pipe(
            map(tasks => ({ tasks, listId })),
          )
        : empty()
    }),
    map(({ tasks, listId }) => actionCreators.setTasks({ tasks, listId })),
  )
}

export const rootEpic = combineEpics(tasksEpic)
