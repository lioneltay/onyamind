import { createEpicMiddleware, ofType, combineEpics } from "redux-observable"
import {
  mergeMap,
  filter,
  map,
  endWith,
  withLatestFrom,
  last,
  takeUntil,
} from "rxjs/operators"
import { Observable, empty, of } from "rxjs"
import { Action } from "../actions"

import { State } from "../reducer"

import { StateObservable } from "redux-observable"

const placeholderEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(filter(action => false))
}

export const rootEpic = combineEpics(placeholderEpic)
