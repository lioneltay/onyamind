import { combineEpics } from "redux-observable"
import { Observable, empty } from "rxjs"
import { map } from "rxjs/operators"
import { Action, actionCreators } from "../actions"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

import { firebase } from "services/firebase"

export const createUserStream = () =>
  new Observable<User | null>(observer => {
    return firebase.auth().onAuthStateChanged(user => observer.next(user))
  })

const authStateChangedEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return createUserStream().pipe(map(user => actionCreators.setUser(user)))
}

export const rootEpic = combineEpics(authStateChangedEpic)
