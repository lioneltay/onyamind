import { firebase, firestore, dataWithId } from "services/firebase"
import { noUndefinedValues } from "lib/utils"
import { move } from "ramda"

export const getTaskList = async (listId: ID): Promise<TaskList | null> => {
  const x = await firestore
    .collection("taskList")
    .doc(listId)
    .get()
    .then((res) => (res.exists ? dataWithId(res) : null))

  return x as TaskList | null
}

type AddTaskListInput = Omit<
  TaskList,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "numberOfIncompleteTasks"
  | "numberOfCompleteTasks"
>
export const createTaskList = async (
  list: AddTaskListInput,
): Promise<TaskList> => {
  return firestore
    .collection("taskList")
    .add({
      numberOfIncompleteTasks: 0,
      numberOfCompleteTasks: 0,
      ...list,
      primary: list.primary ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      taskOrder: [],
    })
    .then(async (x) => {
      return dataWithId(await x.get()) as TaskList
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}

type EditTaskListInput = {
  listId: ID
  data: Partial<Omit<TaskList, "id" | "createdAt" | "updatedAt">>
}
export const editTaskList = async ({
  listId,
  data,
}: EditTaskListInput): Promise<TaskList> => {
  await firestore
    .collection("taskList")
    .doc(listId)
    .update(
      noUndefinedValues({
        ...data,
        updatedAt: Date.now(),
      }),
    )

  const editedList = await firestore
    .collection("taskList")
    .doc(listId)
    .get()
    .then(dataWithId)

  return editedList as TaskList
}

export const deleteTaskList = async (listId: ID): Promise<ID> => {
  await firestore.collection("taskList").doc(listId).delete()

  return listId
}

export const getTaskLists = async (userId: ID | null): Promise<TaskList[]> => {
  return firestore
    .collection("taskList")
    .where("userId", "==", userId)
    .get()
    .then((res) => res.docs.map(dataWithId) as TaskList[])
}

type SetPrimaryTaskListInput = {
  userId: ID | null
  listId: ID
}
export const setPrimaryTaskList = async ({
  userId,
  listId,
}: SetPrimaryTaskListInput) => {
  const taskLists = await getTaskLists(userId)

  const batch = firestore.batch()

  batch.update(firestore.collection("taskList").doc(listId), {
    primary: true,
  })

  taskLists
    .filter((list) => list.id !== listId && list.primary)
    .forEach((list) => {
      batch.update(firestore.collection("taskList").doc(list.id), {
        primary: false,
      })
    })

  return batch.commit()
}

type OnTaskListsChangeInput = {
  userId: ID
  onChange: (lists: TaskList[]) => void
}

export const onTaskListsChange = ({
  userId,
  onChange,
}: OnTaskListsChangeInput) => {
  return firestore
    .collection("taskList")
    .where("userId", "==", userId)
    .onSnapshot((snapshot) => {
      const taskLists = snapshot.docs.map((doc) => dataWithId(doc) as TaskList)
      onChange(taskLists)
    })
}

type ReorderTasksInput = {
  listId: ID
  /** Current task order of the listId list */
  taskOrder: ID[] | undefined
  fromTaskId: ID
  toTaskId: ID
}
export async function reorderTasks({
  listId,
  taskOrder = [],
  fromTaskId,
  toTaskId,
}: ReorderTasksInput) {
  const fromIndex = taskOrder.indexOf(fromTaskId)
  const toIndex = taskOrder.indexOf(toTaskId)

  console.log(listId, taskOrder, fromTaskId, toTaskId)

  if (fromIndex < 0 || toIndex < 0) {
    throw Error("Invalid arguments")
  }

  return firestore
    .collection("taskList")
    .doc(listId)
    .update({
      taskOrder: move(fromIndex, toIndex, taskOrder),
    })
}
