import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, of } from "rxjs"
import { mergeMap, withLatestFrom } from "rxjs/operators"

import { StateObservable } from "redux-observable"

import { Action, State } from "services/store"

const closeDrawerEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("SELECT_TASK_LIST"),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return state.ui.showDrawer
        ? of({
            type: "CLOSE_DRAWER",
          } as const)
        : empty()
    }),
  )
}

export const rootEpic = combineEpics(closeDrawerEpic)
