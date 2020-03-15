import { combineEpics } from "redux-observable"
import { Observable, empty } from "rxjs"
import { map, switchMap, distinctUntilChanged } from "rxjs/operators"
import { Action, actionCreators } from "../actions"
import { firestore, dataWithId } from "services/firebase"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

const createTrashTasksObservable = (userId: ID) =>
  new Observable<Task[]>(observer => {
    return firestore
      .collection("task")
      .where("userId", "==", userId)
      .where("archived", "==", true)
      .onSnapshot(snapshot => {
        const tasks = snapshot.docs.map(doc => dataWithId(doc) as Task)
        observer.next(tasks)
      })
  })

const trashTasksEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => state.auth?.user?.uid ?? null),
    distinctUntilChanged(),
    switchMap(userId =>
      userId ? createTrashTasksObservable(userId) : empty(),
    ),
    map(tasks => actionCreators.setTrashTasks(tasks)),
  )
}

export const rootEpic = combineEpics(trashTasksEpic)
