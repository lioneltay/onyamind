import firebase_import from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

export const firebase = firebase_import

var config = {
  apiKey: "AIzaSyC0hvPquqsBgTnUem_05Kr2e0YInyFs-DE",
  authDomain: "tekktekk-notes.firebaseapp.com",
  databaseURL: "https://tekktekk-notes.firebaseio.com",
  projectId: "tekktekk-notes",
  storageBucket: "tekktekk-notes.appspot.com",
  messagingSenderId: "84965345227",
}

firebase.initializeApp(config)

export const firestore = firebase.firestore()

firestore.settings({})

firestore
  .enablePersistence({
    experimentalTabSynchronization: true,
  })
  .catch(function(err) {
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

export function dataWithId(
  doc: firebase.firestore.DocumentSnapshot,
): firebase.firestore.DocumentData {
  const data = doc.data()
  return { ...data, id: doc.id }
}
