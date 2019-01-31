import { createReducer } from "lib/rxstate"

import { dataWithId, firestore } from "services/firebase"
import { Observable } from "rxjs"
import { switchMap, map } from "rxjs/operators"

import { user_s } from "services/state/modules/auth"

export type State = {
  archived_tasks: Task[] | null
}

export const initial_state: State = {
  archived_tasks: null,
}

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
    map(archived_tasks => (state: State) => ({
      ...state,
      archived_tasks,
    })),
  ),
)
