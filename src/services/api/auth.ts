import { firebase, auth, firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"

const googleProvider = new firebase.auth.GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: "select_account",
})

export const signinWithGoogle = () => {
  return firebase.auth().signInWithPopup(googleProvider)
}

const migrateUserData = async (fromUserId: ID, toUserId: ID) => {
  const taskLists = await firestore
    .collection("taskList")
    .where("userId", "==", fromUserId)
    .get()
    .then(res => res.docs.map(dataWithId))

  const updateTasks = () =>
    Promise.all(
      taskLists.map(async list => {
        const tasks = await firestore
          .collection("task")
          .where("userId", "==", fromUserId)
          .where("listId", "==", list.id)
          .get()
          .then(res => res.docs.map(dataWithId))

        const batch = firestore.batch()

        tasks.forEach(task =>
          batch.update(firestore.collection("task").doc(task.id), {
            userId: toUserId,
          }),
        )

        await batch.commit()
      }),
    )

  const listBatch = firestore.batch()

  const userAlreadyHasPrimaryList =
    (await firestore
      .collection("taskList")
      .where("userId", "==", toUserId)
      .where("primary", "==", true)
      .get()
      .then(res => res.docs.length)) > 0

  taskLists.forEach(list => {
    const ref = firestore.collection("taskList").doc(list.id)
    if (list.demo) {
      listBatch.delete(ref)
    } else {
      listBatch.update(ref, {
        userId: toUserId,
        ...(userAlreadyHasPrimaryList ? { primary: false } : undefined),
      })
    }
  })

  const settings = await firestore
    .collection("settings")
    .where("userId", "==", fromUserId)
    .get()
    .then(res => res.docs.map(dataWithId))

  const settingsBatch = firestore.batch()

  settings.forEach(settings =>
    settingsBatch.update(firestore.collection("settings").doc(settings.id), {
      userId: toUserId,
    }),
  )

  await Promise.all([listBatch.commit(), settingsBatch.commit(), updateTasks()])
}

export const linkAnonymousAccountWithGoogle = async () => {
  const anonUser = auth.currentUser
  assert(anonUser?.isAnonymous, "No anonymous user currently signed in")

  const { user } = await signinWithGoogle()
  assert(user?.uid, "Google sign in fail")

  await migrateUserData(anonUser.uid, user.uid)

  await anonUser.delete()
}

export const signinAnonymously = () => {
  return firebase.auth().signInAnonymously()
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
