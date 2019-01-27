import { createReducer } from "lib/rxstate"
import { State } from ".."
import { createDispatcher } from "services/state/tools"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { firebase } from "services/firebase"

export const signIn = createDispatcher()
export const signOut = createDispatcher()

export const user_s = new Observable<User | null>(observer => {
  return firebase.auth().onAuthStateChanged(user => observer.next(user))
})

export const reducer_s = createReducer<State>(
  user_s.pipe(map(user => (state: State) => ({ ...state, user }))),

  signIn.pipe(
    map(() => {
      const google_provider = new firebase.auth.GoogleAuthProvider()

      google_provider.setCustomParameters({
        prompt: "select_account",
      })

      firebase.auth().signInWithPopup(google_provider)

      return (state: State) => state
    }),
  ),

  signOut.pipe(
    map(() => {
      firebase.auth().signOut()
      return (state: State) => state
    }),
  ),
)
