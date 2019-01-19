import axios from "axios"

export type ID = string

export type Task = {
  id: ID
  title: string
  complete: boolean
  created_at: number
  updated_at: number
}

const host =
  process.env.APP_MODE === "development"
    ? "http://localhost:3030"
    : process.env.APP_MODE === "production"
    ? "https://api.notes.tekktekk.com"
    : "fail"

const makeURL = (path: string): string => `${host}${path}`

export const getTasks = (): Promise<Task[]> =>
  axios.post(makeURL("/task/getTasks")).then(response => response.data)

export const getTask = (task_id: ID): Promise<Task> =>
  axios
    .post(makeURL("/task/getTask"), { task_id })
    .then(response => response.data)

export const addTask = (task: Omit<Task, "id">): Promise<Task> =>
  axios.post(makeURL("/task/addTask"), { task }).then(response => response.data)

export const editTask = (
  task_id: ID,
  task_data: Partial<Omit<Task, "id">>,
): Promise<Task> =>
  axios
    .post(makeURL("/task/editTask"), { task_id, data: task_data })
    .then(response => response.data)

export const removeTask = (task_id: ID): Promise<{ id: ID }> =>
  axios
    .post(makeURL("/task/removeTask"), { task_id })
    .then(response => response.data)
