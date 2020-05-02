import * as functions from "firebase-functions"
import { admin } from "../utils/firebase"
import * as firebase from "firebase-admin"

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
 * Keep list.taskOrder in sync when moving/deleting tasks
 */
export const syncListTaskOrder = functions.firestore
  .document("/taskList/{listId}")
  .onWrite(async (change, context) => {
    const before = change.before.data() as Task | undefined
    const after = change.after.data() as Task | undefined

    type UpdateInput = {
      taskId: ID
      listId: ID
    }
    function removeTaskFromOrder({ taskId, listId }: UpdateInput) {
      return admin
        .firestore()
        .collection("taskList")
        .doc(listId)
        .update({
          taskOrder: firebase.firestore.FieldValue.arrayRemove(taskId),
        })
    }

    // Update
    if (before && after) {
      // Handle moving a task
      if (before.listId !== after.listId) {
        return removeTaskFromOrder({ taskId: before.id, listId: before.listId })
      }

      return
    }

    // Create
    if (!before && after) {
      // do nothing
      return
    }

    // Delete
    if (before && !after) {
      return removeTaskFromOrder({ taskId: before.id, listId: before.listId })
    }

    return
  })
