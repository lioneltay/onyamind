import firebase from "firebase"

export type ID = string

export type Task = {
  id: ID
  uid: ID | null
  title: string
  notes: string
  complete: boolean
  created_at: number
  updated_at: number
  position: number
}

export type User = firebase.User
//  {
//   uid: ID
//   email: string | null
//   photoURL: string
//   displayName: string | null
// }
