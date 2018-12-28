export type ID = string

export type Task = {
  id: ID
  title: string
  complete: boolean
  created_at: number
  updated_at: number
}

export type User = {
  uid: ID
  email: string | null
}
