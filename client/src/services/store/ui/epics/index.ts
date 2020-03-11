import { combineEpics } from "redux-observable"
import { Observable, empty } from "rxjs"
import { Action } from "../actions"

import { State } from "../reducer"

import { StateObservable } from "redux-observable"

const simpleCrudEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return empty()
}

export const rootEpic = combineEpics(simpleCrudEpic)
