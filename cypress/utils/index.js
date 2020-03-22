import firebase from "firebase"

const stagingConfig = {
  apiKey: "AIzaSyCRc0uxLhDmgl6x6PshIl6jmL8qott55is",
  authDomain: "onyamind-staging.firebaseapp.com",
  databaseURL: "https://onyamind-staging.firebaseio.com",
  projectId: "onyamind-staging",
  storageBucket: "onyamind-staging.appspot.com",
  messagingSenderId: "990926290122",
  appId: "1:990926290122:web:9bc7b229c4b13a9f3e8833",
  measurementId: "G-6G31QSBL1H",
}

firebase.initializeApp(stagingConfig)

const firestore = firebase.firestore()

firestore.enablePersistence({
  synchronizeTabs: false,
})

const deleteCollection = async collection => {
  const items = await firestore.collection(collection).get()
  const batch = firestore.batch()
  items.forEach(doc =>
    batch.delete(firestore.collection(collection).doc(doc.id)),
  )
  return batch.commit()
}

export const resetDB = () => {
  return Promise.all([
    deleteCollection("task"),
    deleteCollection("taskList"),
    deleteCollection("settings"),
  ])
}
