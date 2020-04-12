import firebase from "firebase"

declare global {
  // interface Window {
  //   serviceWorkerRegistration: ServiceWorkerRegistration | undefined
  // }

  export type User = Pick<
    firebase.User,
    | "uid"
    | "email"
    | "photoURL"
    | "displayName"
    | "isAnonymous"
    | "providerData"
  >
}

export {}
