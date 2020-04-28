import * as functions from "firebase-functions"
import { admin } from "../utils/firebase"

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
