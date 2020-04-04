import firebase from "firebase"

declare global {
  export type User = Pick<
    firebase.User,
    "uid" | "email" | "photoURL" | "displayName" | "isAnonymous"
  >
}

export {}
