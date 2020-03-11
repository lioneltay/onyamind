import { firebase } from "services/firebase"

export const signin = () => {
  const google_provider = new firebase.auth.GoogleAuthProvider()

  google_provider.setCustomParameters({
    prompt: "select_account",
  })

  return firebase.auth().signInWithPopup(google_provider)
}

export const signout = () => {
  return firebase.auth().signOut()
}
