import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp()

type ID = string
// type Settings = {
//   id: ID
//   userId: ID
//   darkMode: boolean
//   createdAt: number
//   updatedAt: number
// }

// type TaskList = {
//   id: ID
//   userId: ID
//   name: string
//   createdAt: Date
//   updatedAt: Date | null
//   numberOfCompleteTasks: number
//   numberOfIncompleteTasks: number
//   primary: boolean
// }

type Task = {
  id: ID
  listId: ID
  userId: ID
  archived: boolean
  complete: boolean
  createdAt: Date
  updatedAt: Date | null
  notes?: string
  title: string
}

const dataWithId = (
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
) => ({ id: doc.id, ...doc.data })

export const doStuff = functions.https.onCall((data, context) => {
  console.log("DOING STUFF", data)

  return Promise.resolve(53)
})

export const shitEverywhere = functions.firestore
  .document("/task/{taskId}")
  .onCreate((doc, context) => {
    console.log("shitting")
  })

export const updateDemoListFlag = functions.firestore
  .document("/taskList/{listId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data()

    const after = change.after.data()

    if (
      after?.demo &&
      (before?.numberOfCompleteTasks !== after?.numberOfCompleteTasks ||
        before?.numberOfIncompleteTasks !== after?.numberOfIncompleteTasks)
    ) {
      await admin
        .firestore()
        .collection("taskList")
        .doc(change.after.id)
        .update({ demo: false })
    }
  })

/**
 * Keep taskList numberOfCompleteTasks and numberOfIncompleteTasks up to date as tasks are changed
 */
export const syncListTaskCount = functions.firestore
  .document("/task/{taskId}")
  .onWrite(async (change, context) => {
    const before = change.before.data() as Task | undefined
    const after = change.after.data() as Task | undefined

    type UpdateInput = {
      task: Task
      num: number
    }
    function updateCount({ task, num }: UpdateInput) {
      return admin
        .firestore()
        .collection("taskList")
        .doc(task.listId)
        .update({
          [task.complete
            ? "numberOfCompleteTasks"
            : "numberOfIncompleteTasks"]: admin.firestore.FieldValue.increment(
            num,
          ),
        })
    }

    // Update
    if (before && after) {
      if (
        // Trash updates don't matter
        (before.archived && after.archived) ||
        // No count affecting properties have changed
        (before.archived === after.archived &&
          before.complete === after.complete &&
          before.listId === after.listId)
      ) {
        // Nothing changed
        return
      }

      if (before.archived && !after.archived) {
        // Unarchiving - after list gained a task
        return updateCount({ task: after, num: 1 })
      }

      if (!before.archived && after.archived) {
        // Archiving - before list lost a task
        return updateCount({ task: before, num: -1 })
      }

      // What ever happens the previous 'loses' a task and the after 'gains'
      return Promise.all([
        updateCount({ task: before, num: -1 }),
        updateCount({ task: after, num: 1 }),
      ])
    }

    // Create
    if (!before && after) {
      updateCount({ task: after, num: 1 })
    }

    // Delete - do nothing
    if (before && !after) {
      return
    }

    return
  })

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
