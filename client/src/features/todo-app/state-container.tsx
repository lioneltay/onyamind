import { open, getObjectStore } from "lib/idb"
import { createStateContainer, ExtractContextType } from "lib/state-container"
import uuid from "uuid/v4"
import { sequenceMap } from "lib/promise"
import * as api from "./api"
import { Task, ID } from "./api"

// IndexedDB ===============================
const db_promise = open("TaskDatabase", 1, db => {
  console.log("IndexedDB Version", db.oldVersion, db.version)

  switch (db.oldVersion) {
    case 0: {
      db.createObjectStore("Task")
      db.createObjectStore("TaskSync")
      console.log("Version 1 Upgrade Complete")
    }
  }
})

const task_sync_store = getObjectStore(db_promise, "TaskSync")
const task_store = getObjectStore(db_promise, "Task")

// Background Sync =======================

type Action =
  | {
      type: "add"
      task: Task
      id: ID
    }
  | {
      type: "edit"
      data: Task
      id: ID
    }
  | {
      type: "remove"
      id: ID
    }

type SyncData = Map<ID, Action[]>

const KEY = "queue"

async function getSyncData(): Promise<SyncData> {
  return task_sync_store.get(KEY)
}

async function setSyncData(data: SyncData): Promise<void> {
  return task_sync_store.set(KEY, data)
}

async function removeOfflineAction(id: ID): Promise<void> {
  const sync_data = await getSyncData()
  sync_data.delete(id)
  return setSyncData(sync_data)
}

async function addOfflineAction(action: Action): Promise<void> {
  const sync_data = (await getSyncData()) || new Map()

  switch (action.type) {
    case "add": {
      const id = action.id
      const sync_item = sync_data.get(id) || []
      sync_data.set(id, [...sync_item, { type: "add", task: action.task, id }])
      return setSyncData(sync_data)
    }

    case "remove": {
      const id = action.id
      const sync_item = sync_data.get(id) || []
      sync_data.set(id, [...sync_item, { type: "remove", id }])
      return setSyncData(sync_data)
    }

    case "edit": {
      const id = action.id
      const actions = sync_data.get(id) || []
      sync_data.set(id, [...actions, { type: "edit", id, data: action.data }])
      return setSyncData(sync_data)
    }

    default: {
      ;((n: never) => {})(action)
    }
  }
}

async function syncTheData() {
  console.log("\nSyncing the data now\n")
  const sync_data = await getSyncData()
  const ids = Array.from(sync_data.keys())

  return sequenceMap(ids, async id => {
    const actions = sync_data.get(id) || []
    await processActions(actions)
    return removeOfflineAction(id)
  })
}

async function processActions([action, ...rest]: Action[]): Promise<void> {
  if (!action) {
    return
  }

  switch (action.type) {
    case "add": {
      const new_task = await api.addTask(action.task)
      await task_store.get(action.id)
      await task_store.delete(action.id)
      await task_store.set(new_task.id, new_task)
      return processActions(
        rest.map(ac => ({
          ...ac,
          id: new_task.id,
        })),
      )
    }
    case "edit": {
      const new_task = await api.editTask(action.id, action.data)
      await task_store.set(new_task.id, new_task)
      return processActions(rest)
    }
    case "remove": {
      const { id: removed_id } = await api.removeTask(action.id)
      await task_store.delete(removed_id)
      return processActions(rest)
    }
  }
}

// State Container =======================
type ContainerState = {
  tasks: Task[]
}

const initial_state = async (): Promise<ContainerState> => {
  const tasks: Task[] = await task_store.getAll()
  return Promise.resolve({ tasks })
}

function onlineHandler() {
  console.log("Online")
  return syncTheData()
}

function offlineHandler() {
  console.log("Offline")
}

export const StateContainer = createStateContainer({
  initial_state,

  componentDidMount: updateState => {
    window.addEventListener("online", async () => {
      await onlineHandler()
      const tasks = await task_store.getAll()
      updateState({ tasks })
    })
    window.addEventListener("offline", offlineHandler)
  },

  componentWillUnmount() {
    window.removeEventListener("online", onlineHandler)
    window.removeEventListener("offline", offlineHandler)
  },

  actions: updateState => ({
    getTasks: async (): Promise<Task[]> => {
      const tasks: Task[] = await api.getTasks()
      await Promise.all(tasks.map(task => task_store.set(task.id, task)))

      updateState({ tasks })
      return tasks
    },

    getTask: async (task_id: ID): Promise<Task> => {
      const task = await api.getTask(task_id)
      await task_store.set(task.id, task)

      updateState(state => {
        const existing_index = state.tasks.findIndex(
          task => task.id === task_id,
        )

        return {
          tasks: existing_index
            ? [
                ...state.tasks.slice(0, existing_index),
                task,
                ...state.tasks.slice(existing_index),
              ]
            : [...state.tasks, task],
        }
      })

      return task
    },

    addTask: async (task: Omit<Task, "id">): Promise<Task> => {
      async function addTask(task: Omit<Task, "id">): Promise<Task> {
        if (navigator.onLine) {
          const new_task = await api.addTask(task)
          await task_store.set(new_task.id, new_task)
          return new_task
        }

        const id = uuid()
        const new_task = { id, ...task }
        await task_store.set(new_task.id, new_task)
        await addOfflineAction({ type: "add", task: new_task, id })
        return new_task
      }

      const new_task = await addTask(task)
      updateState(state => ({
        title: "",
        tasks: [...state.tasks, new_task],
      }))
      return new_task
    },

    editTask: async (
      task_id: ID,
      task_data: Partial<Omit<Task, "id">>,
    ): Promise<Task> => {
      async function editTask(
        task_id: ID,
        task_data: Partial<Omit<Task, "id">>,
      ): Promise<Task> {
        if (navigator.onLine) {
          const new_task = await api.editTask(task_id, task_data)
          await task_store.set(new_task.id, new_task)
          return new_task
        }

        const old_task = await task_store.get(task_id)
        const new_task = { ...old_task, ...task_data, id: task_id }
        await task_store.set(task_id, new_task)
        await addOfflineAction({ type: "edit", data: new_task, id: task_id })
        return new_task
      }

      const new_task = await editTask(task_id, task_data)
      updateState(state => {
        const index = state.tasks.findIndex(task => task.id === task_id)
        return {
          title: "",
          tasks: [
            ...state.tasks.slice(0, index),
            new_task,
            ...state.tasks.slice(index + 1),
          ],
        }
      })
      return new_task
    },

    removeTask: async (task_id: ID): Promise<ID> => {
      async function removeTask(task_id: ID): Promise<ID> {
        if (navigator.onLine) {
          await api.removeTask(task_id)
          await task_store.delete(task_id)
          return task_id
        }

        await addOfflineAction({ type: "remove", id: task_id })
        return task_id
      }

      await removeTask(task_id)
      updateState(state => ({
        tasks: state.tasks.filter(t => t.id !== task_id),
      }))
      await task_store.delete(task_id)
      return task_id
    },
  }),
})

export type ContextType = ExtractContextType<typeof StateContainer.Context>
