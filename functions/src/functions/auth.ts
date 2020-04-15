import * as functions from "firebase-functions"

import { auth } from "firebase-admin"
import { admin } from "../utils/firebase"

const dataWithId = (
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
) => ({ id: doc.id, ...doc.data() })

const firestore = admin.firestore()

function isAnonymouseUser(user: auth.UserRecord) {
  return user.providerData.length === 0
}

export const migrateUserData = functions.https.onCall(
  async (
    { fromUserId, toUserId }: CallableFunction.MigrateUserDataData,
    context,
  ) => {
    const fromUser = await admin.auth().getUser(fromUserId)

    /**
     * You must be logged in as the 'toUser' and the 'fromUser' must be anonymous (having no auth providers)
     * Someone could potential steal your data if you never signed in and they somehow got a hold of your anonymous userId. However they would have to have access to your device to do that in which case they could do whatever they want anyway
     */

    if (context.auth?.uid !== toUserId && !isAnonymouseUser(fromUser)) {
      return new Error("Not authorized")
    }

    const taskLists = (await firestore
      .collection("taskList")
      .where("userId", "==", fromUserId)
      .get()
      .then((res) => res.docs.map(dataWithId))) as TaskList[]

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
      if (
        list.name === "Todo" &&
        (list.numberOfCompleteTasks || 0) +
          (list.numberOfIncompleteTasks || 0) ===
          0
      ) {
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

    await Promise.all([
      listBatch.commit(),
      settingsBatch.commit(),
      updateTasks(),
    ])

    return admin.auth().deleteUser(fromUserId)
  },
)
