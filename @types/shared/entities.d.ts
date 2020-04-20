declare global {
  export type ID = string

  export type Settings = {
    id: ID
    userId: ID
    darkMode: boolean
    createdAt: number
    updatedAt: number
  }

  export type TaskList = {
    id: ID
    userId: ID
    name: string
    createdAt: Date
    updatedAt: Date | null
    numberOfCompleteTasks: number
    numberOfIncompleteTasks: number
    primary: boolean
    /**
     * The order of tasks in the list, may not include all tasks of the list.
     * The order contains tasks in the reverse order, bottom to top.
     * This is because firestore arrayUnion appends new items to the end.
     */
    taskOrder?: ID[]
  }

  export type Task = {
    id: ID
    listId: ID
    userId: ID
    archived: boolean
    complete: boolean
    createdAt: Date
    updatedAt: Date | null
    notes?: string
    title: string
  }
}

export {}
