import { firebase, firestore, dataWithId } from "services/firebase"

type AddTaskListInput = Omit<
  TaskList,
  | "id"
  | "created_at"
  | "updated_at"
  | "number_of_incomplete_tasks"
  | "number_of_complete_tasks"
>
export const addTaskList = async (
  list: AddTaskListInput,
): Promise<TaskList> => {
  return firestore
    .collection("task_lists")
    .add({
      number_of_incomplete_tasks: 0,
      number_of_complete_tasks: 0,
      primary: false,
      user_id: null,
      ...list,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as TaskList
    })
    .catch(e => {
      console.log(e)
      return e
    })
}

type EditTaskListInput = {
  list_id: ID
  list_data: Partial<Omit<TaskList, "id" | "created_at" | "updated_at">>
}
export const editTaskList = async ({
  list_id,
  list_data,
}: EditTaskListInput): Promise<TaskList> => {
  await firestore
    .collection("task_lists")
    .doc(list_id)
    .update({
      ...list_data,
      updated_at: Date.now(),
    })

  const edited_list = await firestore
    .collection("task_lists")
    .doc(list_id)
    .get()
    .then(dataWithId)

  return edited_list as TaskList
}

export const removeTaskList = async (list_id: ID): Promise<ID> => {
  await firestore
    .collection("task_lists")
    .doc(list_id)
    .delete()
  return list_id
}

export const createDefaultTaskList = (user_id: ID | null) => {
  return addTaskList({
    name: "Tasks",
    primary: true,
    user_id,
  })
}

export const getTaskLists = async (user_id: ID | null): Promise<TaskList[]> => {
  return firestore
    .collection("task_lists")
    .where("user_id", "==", user_id)
    .get()
    .then(res => res.docs.map(dataWithId) as TaskList[])
}

type SetPrimaryTaskListInput = {
  user_id: ID | null
  task_list_id: ID
}
export const setPrimaryTaskList = async ({
  user_id,
  task_list_id,
}: SetPrimaryTaskListInput) => {
  const task_lists = await getTaskLists(user_id)

  const batch = firestore.batch()

  batch.update(firestore.collection("task_lists").doc(task_list_id), {
    primary: true,
  })

  task_lists
    .filter(list => list.id !== task_list_id && list.primary)
    .forEach(list => {
      batch.update(firestore.collection("task_lists").doc(list.id), {
        primary: false,
      })
    })

  return batch.commit()
}
