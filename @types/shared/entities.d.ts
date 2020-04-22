declare global {
  export type ID = string
  export type Timestamp = number

  export type Settings = {
    id: ID
    userId: ID
    darkMode: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
  }

  export type TaskList = {
    id: ID
    userId: ID
    name: string
    createdAt: Timestamp
    updatedAt: Timestamp | null
    numberOfCompleteTasks: number
    numberOfIncompleteTasks: number
    primary: boolean
    /** The order of tasks in the list, may not include all tasks of the list. */
    taskOrder?: ID[]
    /** Whether or not this list is a routine list */
    routine?: boolean
  }

  export type Task = {
    id: ID
    listId: ID
    userId: ID
    archived: boolean
    complete: boolean
    createdAt: Timestamp
    updatedAt: Timestamp | null
    completedAt?: Timestamp | null
    notes?: string
    title: string
  }
}

export {}
