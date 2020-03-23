import firebaseImport from "firebase/app"
import "firebase/firestore"
import "firebase/functions"
import "firebase/auth"

import { config } from "./config"

const isProduction = process.env.APP_MODE === "production"
const isLocal =
  process.env.NODE_ENV === "test" || process.env.APP_MODE === "local"

export const firebase = firebaseImport

firebase.initializeApp(isProduction ? config.production : config.staging)

export const firestore = firebase.firestore()
export const auth = firebase.auth()

if (isLocal) {
  console.log("FIRESTORE USING EMULATOR")
  firestore.settings({
    host: "localhost:8080",
    ssl: false,
  })

  console.log("FUNCTIONS USING EMULATOR")
  firebase.functions().useFunctionsEmulator("http://localhost:5001")
} else {
  firestore
    .enablePersistence({
      synchronizeTabs: true,
    })
    .catch(function (err) {
      if (err.code == "failed-precondition") {
        console.log(`
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    `)
      } else if (err.code == "unimplemented") {
        console.log(`
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    `)
      }
    })
}

const doStuff = firebase.functions().httpsCallable("doStuff")

console.log("CALLING")
doStuff({ shit: "poo" })
  .then((res) => console.log("called doStuff", res))
  .catch((e) => console.error("FAILED TO CALL DOSTUFF", e))
