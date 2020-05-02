import { firestore, dataWithId, firebase } from "services/firebase"

import { noUndefinedValues } from "lib/utils"

type PartialTaskWithID = Partial<Task> & { id: ID }

export const createTask = async (
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "complete">,
) => {
  const batch = firestore.batch()

  const newTaskRef = firestore.collection("task").doc()
  const taskData = {
    ...task,
    userId: task.userId || null,
    complete: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
  }

  batch.set(newTaskRef, taskData)

  // batch.update(firestore.collection("taskList").doc(task.listId), {
  //   taskOrder: firebase.firestore.FieldValue.arrayUnion(newTaskRef.id),
  // })

  await batch.commit()
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

export const editTasks = async (tasks: PartialTaskWithID[]): Promise<void> => {
  const batch = firestore.batch()

  tasks.forEach((task) => {
    batch.update(firestore.collection("task").doc(task.id), {
      ...task,
      updatedAt: Date.now(),
    })
  })

  return batch.commit()
}

type DeleteTaskInput = {
  taskId: ID
  listId: ID
}
export const deleteTask = async ({ taskId, listId }: DeleteTaskInput) => {
  const batch = firestore.batch()

  batch.delete(firestore.collection("task").doc(taskId))
  batch.update(firestore.collection("taskList").doc(listId), {
    taskOrder: firebase.firestore.FieldValue.arrayRemove(taskId),
  })

  await batch.commit()
}

export const deleteTasks = (inputs: DeleteTaskInput[]) => {
  const batch = firestore.batch()

  inputs.forEach(({ taskId, listId }) => {
    batch.delete(firestore.collection("task").doc(taskId))
    batch.update(firestore.collection("taskList").doc(listId), {
      taskOrder: firebase.firestore.FieldValue.arrayRemove(taskId),
    })
  })

  return batch.commit()
}

type MoveTaskInput = {
  taskId: ID
  fromListId: ID
  toListId: ID
}
const moveTask = async ({ taskId, fromListId, toListId }: MoveTaskInput) => {
  // TODO

  const batch = firestore.batch()

  batch.update(firestore.collection("task").doc(taskId), { listId: toListId })
  batch.update(firestore.collection("taskList").doc(fromListId), {
    numberOfCompleteTasks: 4,
    numberOfIncompleteTasks: 7,
  })
  batch.update(firestore.collection("taskList").doc(fromListId), {
    numberOfCompleteTasks: 4,
    numberOfIncompleteTasks: 7,
  })

  return batch.commit()
}

export async function checkTask(taskId: ID) {
  return editTask({ taskId, data: { complete: true, completedAt: Date.now() } })
}

export async function uncheckTask(taskId: ID) {
  return editTask({ taskId, data: { complete: false, completedAt: null } })
}

export async function uncheckTasks(taskIds: ID[]) {
  return editTasks(
    taskIds.map((id) => ({ id, complete: false, completedAt: null })),
  )
}
