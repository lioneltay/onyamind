export type RawTaskList = {
  id: ID
  name: string
  createdAt: number
  updatedAt: number | null
  numberOfCompleteTasks: number
  numberOfIncompleteTasks: number
  primary: boolean
  userId: ID
}

export type TaskList = {
  id: ID
  name: string
  createdAt: Date
  updatedAt: Date | null
  numberOfCompleteTasks: number
  numberOfIncompleteTasks: number
  primary: boolean
  userId: ID
}

export type Task = {
  id: ID
  archived: boolean
  completed: boolean
  createdAt: Date
  updatedAt: Date | null
  listId: ID
  notes: string
  title: string
}

export type User = {
  id: ID
  name: string | null
  email: string | null
  imageUrl: string | null
}
