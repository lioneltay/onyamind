import { firestore, dataWithId } from "services/firebase"

export const addTask = async (
  task: Omit<
    Task,
    "id" | "created_at" | "updated_at" | "complete" | "archived"
  >,
): Promise<Task> => {
  return firestore
    .collection("tasks")
    .add({
      ...task,
      user_id: task.user_id || null,
      completed: false,
      archived: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as Task
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

type EditTaskPayload = {
  task_id: ID
  task_data: Partial<Omit<Task, "id">>
}
export const editTask = async ({
  task_id,
  task_data,
}: EditTaskPayload): Promise<Task> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .update({
      ...task_data,
      updated_at: Date.now(),
    })

  const edited_task = await firestore
    .collection("tasks")
    .doc(task_id)
    .get()
    .then(dataWithId)

  return edited_task as Task
}

type EditTasksPayload = {
  task_ids: ID[]
  task_data: Partial<Omit<Task, "id">>
}
export const editTasks = async ({
  task_ids,
  task_data,
}: EditTasksPayload): Promise<void> => {
  const batch = firestore.batch()

  task_ids.forEach(id => {
    batch.update(firestore.collection("tasks").doc(id), {
      ...task_data,
      updated_at: Date.now(),
    })
  })

  return batch.commit()
}

export const checkTasks = (task_ids: ID[]) => {
  return editTasks({
    task_ids,
    task_data: { complete: true },
  })
}

export const uncheckTasks = (task_ids: ID[]) => {
  return editTasks({
    task_ids,
    task_data: { complete: false },
  })
}

export const archiveTask = (task_id: ID) => {
  return editTask({
    task_id,
    task_data: { archived: true },
  })
}

export const archiveTasks = (task_ids: ID[]) => {
  return editTasks({
    task_ids,
    task_data: { archived: true },
  })
}

export const unarchiveTask = (task_id: ID) => {
  return editTask({
    task_id,
    task_data: { archived: false },
  })
}

export const unarchiveTasks = (task_ids: ID[]) => {
  return editTasks({
    task_ids,
    task_data: { archived: false },
  })
}

export const deleteTask = async (task_id: ID): Promise<ID> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .delete()
  return task_id
}

export const deleteTasks = (task_ids: ID[]) => {
  const batch = firestore.batch()

  task_ids.forEach(id => {
    batch.delete(firestore.collection("tasks").doc(id))
  })

  return batch.commit()
}
