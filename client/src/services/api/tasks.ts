import { firestore, dataWithId } from "services/firebase"

export const createTask = async (
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "complete" | "archived">,
): Promise<Task> => {
  return firestore
    .collection("tasks")
    .add({
      ...task,
      userId: task.userId || null,
      complete: false,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
  taskId: ID
  data: Partial<Omit<Task, "id">>
}
export const editTask = async ({
  taskId,
  data,
}: EditTaskPayload): Promise<Task> => {
  await firestore
    .collection("tasks")
    .doc(taskId)
    .update({
      ...data,
      updatedAt: Date.now(),
    })

  const editedTask = await firestore
    .collection("tasks")
    .doc(taskId)
    .get()
    .then(dataWithId)

  return editedTask as Task
}

export const editTasks = async (tasks: Partial<Task>[]): Promise<void> => {
  const batch = firestore.batch()

  tasks.forEach(task => {
    batch.update(firestore.collection("tasks").doc(task.id), {
      ...task,
      updatedAt: Date.now(),
    })
  })

  return batch.commit()
}

export const deleteTask = async (taskId: ID): Promise<ID> => {
  await firestore
    .collection("tasks")
    .doc(taskId)
    .delete()
  return taskId
}

export const deleteTasks = (taskIds: ID[]) => {
  const batch = firestore.batch()

  taskIds.forEach(id => {
    batch.delete(firestore.collection("tasks").doc(id))
  })

  return batch.commit()
}
