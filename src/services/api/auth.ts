import { firebase } from "services/firebase"

export const signinWithGoogle = () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider()

  googleProvider.setCustomParameters({
    prompt: "select_account",
  })

  return firebase.auth().signInWithPopup(googleProvider)
}

export const signinAnonymously = () => {
  return firebase.auth().signInAnonymously()
}

export const linkGoogleAccount = () => {
  var provider = new firebase.auth.GoogleAuthProvider()

  const auth = firebase.auth()

  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error("No current user to link")
  }

  return currentUser.linkWithPopup(provider)
}

export const signout = () => {
  return firebase.auth().signOut()
}

export const getUser = () => {
  let unsub = () => {}

  return new Promise<User | null>(res => {
    unsub = firebase.auth().onAuthStateChanged(user => {
      unsub()
      res(user)
    })
  })
}
