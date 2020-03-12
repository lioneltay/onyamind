import { firestore, dataWithId } from "services/firebase"
import { pickBy } from "ramda"

import { getTaskList } from "./task-lists"

const noUndefinedValues = pickBy((v, k) => v !== undefined)

export const createTask = async (
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "complete" | "archived">,
): Promise<Task> => {
  return firestore
    .collection("task")
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
  console.log(
    "what",
    noUndefinedValues({
      ...data,
      updatedAt: Date.now(),
    }),
  )
  await firestore
    .collection("task")
    .doc(taskId)
    .update(
      noUndefinedValues({
        ...data,
        updatedAt: Date.now(),
      }),
    )

  const editedTask = await firestore
    .collection("task")
    .doc(taskId)
    .get()
    .then(dataWithId)

  return editedTask as Task
}

export const editTasks = async (tasks: Partial<Task>[]): Promise<void> => {
  const batch = firestore.batch()

  tasks.forEach(task => {
    batch.update(firestore.collection("task").doc(task.id), {
      ...task,
      updatedAt: Date.now(),
    })
  })

  return batch.commit()
}

export const deleteTask = async (taskId: ID): Promise<ID> => {
  await firestore
    .collection("task")
    .doc(taskId)
    .delete()
  return taskId
}

export const deleteTasks = (taskIds: ID[]) => {
  const batch = firestore.batch()

  taskIds.forEach(id => {
    batch.delete(firestore.collection("task").doc(id))
  })

  return batch.commit()
}

type MoveTaskInput = {
  taskId: ID
  fromListId: ID
  toListId: ID
}
export const moveTask = async ({
  taskId,
  fromListId,
  toListId,
}: MoveTaskInput) => {
  // TODO

  const batch = firestore.batch()

  batch.update(firestore.collection("task").doc(taskId), { listId: toListId })

  return batch.commit()
}
