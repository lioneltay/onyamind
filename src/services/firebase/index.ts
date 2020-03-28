export function dataWithId(
  doc: firebase.firestore.DocumentSnapshot,
): firebase.firestore.DocumentData {
  const data = doc.data()
  if (!data) {
    throw Error("No data")
  }
  return { ...data, id: doc.id }
}

export { firebase, firestore, auth } from "./firebase"
