import * as admin from "firebase-admin"

admin.initializeApp({
  credential: "./admin-sdk-key.json",
  databaseURL: 'https://onyamind-staging.firebaseio.com'
});

const firestore = admin.firestore()

firestore.enablePersistence({
  synchronizeTabs: true,
})

const deleteCollection = async collection => {
  const items = await firestore.collection(collection).get()
  const batch = firestore.batch()
  items.forEach(doc =>
    batch.delete(firestore.collection(collection).doc(doc.id)),
  )
  return batch.commit()
}

export const resetDB = async () => {
  // cy.clearCookies()
  // cy.clearLocalStorage()
  // const databases = await indexedDB.databases()
  await Promise.all([
    deleteCollection("task"),
    deleteCollection("taskList"),
    deleteCollection("settings"),
  ])
  // await Promise.all(databases.map(({ name }) => indexedDB.deleteDatabase(name)))
}
