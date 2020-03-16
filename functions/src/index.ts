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
    const taskLists = await admin
      .firestore()
      .collection("taskList")
      .where("userId", "==", user.uid)
      .get()
      .then(res => res.docs.map(dataWithId))

    // Delete tasks, batch by list
    await Promise.all(
      taskLists.map(async list => {
        const tasks = await admin
          .firestore()
          .collection("task")
          .where("listId", "==", list.id)
          .get()
          .then(res => res.docs.map(dataWithId))

        const batch = admin.firestore().batch()

        tasks.forEach(task =>
          batch.delete(
            admin
              .firestore()
              .collection("task")
              .doc(task.id),
          ),
        )

        return batch.commit()
      }),
    )

    const taskListBatch = admin.firestore().batch()

    // Delete taskLists
    taskLists.forEach(list =>
      taskListBatch.delete(
        admin
          .firestore()
          .collection("list")
          .doc(list.id),
      ),
    )

    await taskListBatch.commit()

    // Delete settings
    const allSettings = await admin
      .firestore()
      .collection("settings")
      .where("userId", "==", user.uid)
      .get()
      .then(res => res.docs.map(dataWithId))

    const settingsBatch = admin.firestore().batch()

    allSettings.forEach(settings =>
      settingsBatch.delete(
        admin
          .firestore()
          .collection("settings")
          .doc(settings.id),
      ),
    )

    return settingsBatch.commit()
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
      .then(res => res.docs.map(dataWithId))

    const batch = admin.firestore().batch()

    tasks.forEach(task =>
      batch.delete(
        admin
          .firestore()
          .collection("task")
          .doc(task.id),
      ),
    )

    return batch.commit()
  })
