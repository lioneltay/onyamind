import axios from "axios"
import { open, getObjectStore } from "./indexdb"

const db_promise = open("TaskDatabase", 1, db => {
  console.log("IndexedDB Version", db.oldVersion, db.version)

  switch (db.oldVersion) {
    case 0: {
      db.createObjectStore("TaskList")
      db.createObjectStore("Task")
      console.log("Version 1 Upgrade Complete")
    }
  }
})

const task_list_store = getObjectStore(db_promise, "TaskList")
const task_store = getObjectStore(db_promise, "Task")

export type TaskList = {
  id: number
  title: string
}

const host = "http://localhost:3030"
const makeURL = (path: string): string => `${host}${path}`

export async function getTaskLists() {
  return axios.post(makeURL("/task/getTaskLists")).then(result => result.data)
}

export async function getTaskList(task_list_id: number) {
  return axios.post(makeURL("/task/getTaskList"), {
    task_list_id,
  })
}

export async function addTaskList(task: Omit<TaskList, "id">) {
  if (!navigator.onLine) {
    alert(`We're offline mate!`)
  }

  return axios
    .post(makeURL("/task/addTaskList"), { task })
    .then(({ data }) => task_list_store.set(data.id, data).then(() => data))
}

export async function removeTask(task_list_id: number) {
  return axios.post(makeURL("/task/removeTaskList"), {
    task_list_id,
  })
}
