import * as functions from "firebase-functions"

import { admin } from "../utils/firebase"

const dataWithId = (
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
) => ({ id: doc.id, ...doc.data })

/**
 * Remove all users TaskLists, Tasks and Settings when deleted
 */
export const removeUserAssetsWhenDelete = functions.auth
  .user()
  .onDelete(async (user, context) => {
    const deleteItemsOfUser = async (collection: string) => {
      const items = await admin
        .firestore()
        .collection(collection)
        .where("userId", "==", user.uid)
        .get()
        .then((res) => res.docs.map(dataWithId))

      const batch = admin.firestore().batch()

      // Delete taskLists
      items.forEach((item) =>
        batch.delete(admin.firestore().collection(collection).doc(item.id)),
      )

      await batch.commit()
    }

    await Promise.all([
      deleteItemsOfUser("taskList"),
      deleteItemsOfUser("settings"),
    ])
  })

export const removeTasksWhenListIsDeleted = functions.firestore
  .document("/taskList/{listId}")
  .onDelete(async (change, context) => {
    const { listId } = context.params

    const tasks = await admin
      .firestore()
      .collection("task")
      .where("listId", "==", listId)
      .get()
      .then((res) => res.docs.map(dataWithId))

    const batch = admin.firestore().batch()

    tasks.forEach((task) =>
      batch.delete(admin.firestore().collection("task").doc(task.id)),
    )

    return batch.commit()
  })
