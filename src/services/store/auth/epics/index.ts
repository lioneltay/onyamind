import { combineEpics } from "redux-observable"
import { assert } from "lib/utils"
import { Observable, empty, from, of } from "rxjs"
import { map, mergeMap, distinctUntilChanged } from "rxjs/operators"
import { Action, actionCreators } from "../actions"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

import { firebase } from "services/firebase"

import * as api from "services/api"

import { INITIAL_TASK_LIST_NAME } from "config"

export const createUserStream = () =>
  new Observable<User | null>(observer => {
    return firebase.auth().onAuthStateChanged(user => observer.next(user))
  })

const initializeUserData = async (userId: ID) => {
  const list = await api.createTaskList({
    name: INITIAL_TASK_LIST_NAME,
    primary: true,
    demo: true,
    userId: userId,
  })

  // await Promise.all([
  //   api.createTask({
  //     title: "My first task!",
  //     userId: userId,
  //     listId: list.id,
  //   }),
  //   api.createTask({
  //     title: "My second task!",
  //     userId: userId,
  //     listId: list.id,
  //   }),
  // ])
}

const authStateChangedEpic = (): Observable<Action> => {
  return createUserStream().pipe(
    mergeMap((user, index) => {
      if (index === 0 && !user) {
        return from(
          api.signinAnonymously().then(async ({ user }) => {
            assert(user, "siginAnonymously Failed")
            await initializeUserData(user.uid)
            return actionCreators.setUser(user)
          }),
        )
      }
      return of(actionCreators.setUser(user))
    }),
  )
}

export const rootEpic = combineEpics(authStateChangedEpic)
