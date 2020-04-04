import { firebase, auth, firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"
import { INITIAL_TASK_LIST_NAME } from "config"
import { createTaskList } from "services/api/task-lists"
import { migrateUserData } from "services/api/callable-functions"

const googleProvider = new firebase.auth.GoogleAuthProvider()

export const onAuthStateChanged = (onChange: (user: User | null) => void) => {
  return firebase.auth().onAuthStateChanged(onChange)
}

googleProvider.setCustomParameters({
  prompt: "select_account",
})

export const initializeUserData = async (userId: ID) => {
  const list = await createTaskList({
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

export const signinWithGoogle = () => {
  return firebase.auth().signInWithPopup(googleProvider)
}

export const linkAnonymousAccountWithGoogle = async (): Promise<User> => {
  const anonUser = auth.currentUser
  assert(anonUser?.isAnonymous, "No anonymous user currently signed in")

  try {
    const { user } = await anonUser.linkWithPopup(googleProvider)
    assert(user?.uid, "Link Fail")
    return user
  } catch (err) {
    const { credential } = err
    const { user } = await auth.signInWithCredential(credential)
    assert(user?.uid, "Google sign in fail")

    await migrateUserData({ fromUserId: anonUser.uid, toUserId: user.uid })

    await anonUser.delete()
    return user
  }
}

export const signinAnonymously = () => {
  console.log("signinanonymously")
  return firebase.auth().signInAnonymously()
}

export const signout = () => {
  return firebase.auth().signOut()
}

export const getUser = () => {
  let unsub = () => {}

  return new Promise<User | null>((res) => {
    unsub = firebase.auth().onAuthStateChanged((user) => {
      unsub()
      res(user)
    })
  })
}
