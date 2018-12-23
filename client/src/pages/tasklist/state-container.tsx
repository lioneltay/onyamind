import axios from "axios"
import { open, getObjectStore } from "./indexdb"
import { createStateContainer, ExtractContextType } from "lib/state-container"
import uuid from "uuid/v4"

// IndexedDB ===============================
const db_promise = open("TaskDatabase", 1, db => {
  console.log("IndexedDB Version", db.oldVersion, db.version)

  switch (db.oldVersion) {
    case 0: {
      db.createObjectStore("TaskList")
      // db.createObjectStore("Task")
      db.createObjectStore("BackgroundSync")
      db.createObjectStore("TaskListTempIds")
      console.log("Version 1 Upgrade Complete")
    }
  }
})

const background_sync_store = getObjectStore(db_promise, "BackgroundSync")
const task_list_store = getObjectStore(db_promise, "TaskList")
const task_list_temp_ids = getObjectStore(db_promise, "TaskListTempIds")
// const task_store = getObjectStore(db_promise, "Task")

// Background Sync =======================
type QueuedAPICall =
  | {
      type: "addTaskList"
      params: {
        temp_id: string | number
        task: TaskList
      }
    }
  | {
      type: "getTaskList"
      params: {
        task_list_id: string | number
      }
    }
  | {
      type: "getTaskLists"
      params: {}
    }
  | {
      type: "removeTaskList"
      params: {}
    }

const KEY = "queue"

async function enqueueApiCall(call_to_queue: QueuedAPICall) {
  const queue = await background_sync_store.get(KEY)
  background_sync_store.set(KEY, [...queue, call_to_queue])
}

async function flushApiCalls() {
  if (!navigator.onLine) {
    return
  }

  const [first, ...rest]: QueuedAPICall[] = await background_sync_store.get(KEY)

  await callApi(first.type, first.params)

  return background_sync_store.set(KEY, rest)
}

async function callApi(type: APICallType, params: any): Promise<unknown> {
  switch (type) {
    case "removeTaskList": {
      return removeTaskList(params.task_list_id)
    }
    case "addTaskList": {
      return addTaskList(params.task)
    }
    case "getTaskLists": {
      return getTaskLists()
    }
    case "getTaskList": {
      return getTaskList(params.task_list_id)
    }
  }
}

// API Helpers ===========================
export type TaskList = {
  id: number | string
  title: string
}

const host = "http://localhost:3030"
const makeURL = (path: string): string => `${host}${path}`

async function getTaskLists(): Promise<TaskList[]> {
  const result = await axios.post(makeURL("/task/getTaskLists"))
  const task_lists: TaskList[] = result.data
  await Promise.all(
    task_lists.map(task_list => task_list_store.set(task_list.id, task_list))
  )
  return task_lists
}

async function getTaskList(task_list_id: number): Promise<TaskList> {
  const response = await axios.post(makeURL("/task/getTaskList"), {
    task_list_id,
  })
  const task_list = response.data
  await task_list_store.set(task_list.id, task_list)
  return task_list
}

async function addTaskList(task: Omit<TaskList, "id">): Promise<TaskList> {
  if (navigator.onLine) {
    const response = await axios.post(makeURL("/task/addTaskList"), { task })
    const new_task = response.data
    await task_list_store.set(new_task.id, new_task)
    return new_task
  }

  const id = uuid()
  const new_task = { id, ...task }
  await task_list_temp_ids.set(id, id)
  await task_list_store.set(new_task.id, new_task)
  return new_task
}

async function removeTaskList(task_list_id: number): Promise<number> {
  await axios.post(makeURL("/task/removeTaskList"), {
    task_list_id,
  })
  await task_list_store.delete(task_list_id)
  return task_list_id
}

// State Container =======================
type ContainerState = {
  task_lists: TaskList[]
}

const initial_state = async (): Promise<ContainerState> => {
  console.log("INITIALISING STATE")
  const task_lists: TaskList[] = await task_list_store.getAll()
  return Promise.resolve({ task_lists })
}

export const StateContainer = createStateContainer({
  initial_state,

  actions: updateState => ({
    getTaskLists: async (): Promise<TaskList[]> => {
      const task_lists = await getTaskLists()
      updateState({ task_lists })
      return task_lists
    },

    getTaskList: async (task_list_id: number): Promise<TaskList> => {
      const task_list = await getTaskList(task_list_id)

      updateState(state => {
        const existing_index = state.task_lists.findIndex(
          task => task.id === task_list_id
        )

        return {
          task_lists: existing_index
            ? [
                ...state.task_lists.slice(0, existing_index),
                task_list,
                ...state.task_lists.slice(existing_index),
              ]
            : [...state.task_lists, task_list],
        }
      })

      return task_list
    },

    addTaskList: async (task: Omit<TaskList, "id">): Promise<TaskList> => {
      const new_task = await addTaskList(task)
      updateState(state => ({
        title: "",
        task_lists: [...state.task_lists, new_task],
      }))
      return new_task
    },

    removeTaskList: async (task_list_id: number): Promise<number> => {
      await removeTaskList(task_list_id)
      updateState(state => ({
        task_lists: state.task_lists.filter(t => t.id !== task_list_id),
      }))
      await task_list_store.delete(task_list_id)
      return task_list_id
    },
  }),
})

export type ContextType = ExtractContextType<typeof StateContainer.Context>
