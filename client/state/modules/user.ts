import { createReducer } from "lib/rxstate"
import { createDispatcher } from "services/state"
import { Observable, empty } from "rxjs"
import { map } from "rxjs/operators"
import { firebase } from "services/firebase"

export type State = User | null

export const initial_state: State = null

export const signIn = empty()
export const signOut = empty()

// export const user_s = new Observable<User | null>(observer => {
//   return firebase.auth().onAuthStateChanged(user => observer.next(user))
// })

export const user_s = empty()

export const reducer_s = createReducer<State>(
  user_s.pipe(map(user => (state: State) => user)),

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
