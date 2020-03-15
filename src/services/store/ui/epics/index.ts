import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, of } from "rxjs"
import { mergeMap, withLatestFrom } from "rxjs/operators"

import { StateObservable } from "redux-observable"

import { Action, State } from "services/store"

const placeHolder = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return empty()
}

export const rootEpic = combineEpics(placeHolder)
