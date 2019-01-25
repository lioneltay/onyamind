import { firestore, dataWithId } from "services/firebase"

export const checkTasks = (task_ids: ID[]) => {
  const batch = firestore.batch()

  task_ids.forEach(id => {
    batch.update(firestore.collection("tasks").doc(id), {
      complete: true,
      updated_at: Date.now(),
    })
  })

  return batch.commit()
}

export const uncheckTasks = (task_ids: ID[]) => {
  const batch = firestore.batch()

  task_ids.forEach(id => {
    batch.update(firestore.collection("tasks").doc(id), {
      complete: false,
      updated_at: Date.now(),
    })
  })

  return batch.commit()
}

export const deleteTasks = (task_ids: ID[]) => {
  const batch = firestore.batch()

  task_ids.forEach(id => {
    batch.delete(firestore.collection("tasks").doc(id))
  })

  return batch.commit()
}
