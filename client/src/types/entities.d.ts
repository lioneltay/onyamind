import firebase from "firebase"

declare global {
  export type ID = string

  export type TaskList = {
    id: ID
    user_id: ID | null
    name: string
    number_of_incomplete_tasks: number
    number_of_complete_tasks: number
    primary: boolean
    created_at: number
    updated_at: number
  }

  export type Task = {
    id: ID
    user_id: ID | null
    list_id: ID | null
    title: string
    notes: string
    complete: boolean
    created_at: number
    updated_at: number
    archived: boolean
  }

  export type User = firebase.User
}

export {}
