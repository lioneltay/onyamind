export type ID = string

export type Task = {
  id: ID
  uid: ID | null
  title: string
  notes: string
  complete: boolean
  created_at: number
  updated_at: number
}

export type User = {
  uid: ID
  email: string | null
}
