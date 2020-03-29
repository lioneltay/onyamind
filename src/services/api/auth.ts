import { firebase, auth, firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"
import { INITIAL_TASK_LIST_NAME } from "config"
import { createTaskList } from "services/api/task-lists"

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

const migrateUserData = async (fromUserId: ID, toUserId: ID) => {
  const taskLists = await firestore
    .collection("taskList")
    .where("userId", "==", fromUserId)
    .get()
    .then((res) => res.docs.map(dataWithId))

  const updateTasks = () =>
    Promise.all(
      taskLists.map(async (list) => {
        const tasks = await firestore
          .collection("task")
          .where("userId", "==", fromUserId)
          .where("listId", "==", list.id)
          .get()
          .then((res) => res.docs.map(dataWithId))

        const batch = firestore.batch()

        tasks.forEach((task) =>
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
      .then((res) => res.docs.length)) > 0

  taskLists.forEach((list) => {
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
    .then((res) => res.docs.map(dataWithId))

  const settingsBatch = firestore.batch()

  settings.forEach((settings) =>
    settingsBatch.update(firestore.collection("settings").doc(settings.id), {
      userId: toUserId,
    }),
  )

  await Promise.all([listBatch.commit(), settingsBatch.commit(), updateTasks()])
}

export const linkAnonymousAccountWithGoogle = async () => {
  const anonUser = auth.currentUser
  assert(anonUser?.isAnonymous, "No anonymous user currently signed in")

  try {
    const { credential } = await anonUser.linkWithPopup(googleProvider)
    assert(credential)
    await auth.signInWithCredential(credential)
  } catch (err) {
    const { credential } = err
    const { user } = await auth.signInWithCredential(credential)
    assert(user?.uid, "Google sign in fail")

    await migrateUserData(anonUser.uid, user.uid)

    await anonUser.delete()
  }
}

export const signinAnonymously = () => {
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
