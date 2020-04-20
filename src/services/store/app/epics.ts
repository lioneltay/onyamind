import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, from } from "rxjs"
import { mergeMap, debounceTime } from "rxjs/operators"
import { assert } from "lib/utils"

import { StateObservable } from "redux-observable"

import { Action, State } from "services/store"

import { reorderTasks } from "services/api"

const reorderSyncEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("REORDER_TASKS"),
    debounceTime(3000),
    mergeMap((action) => {
      assert(action.type === "REORDER_TASKS")
      console.log("SYNCING")
      return from(reorderTasks(action.payload))
    }),
    mergeMap(() => empty()),
  )
}

export const rootEpic = combineEpics(reorderSyncEpic)
