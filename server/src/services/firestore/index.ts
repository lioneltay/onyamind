import {
  Firestore,
  DocumentSnapshot,
  DocumentData,
} from "@google-cloud/firestore"

export const firestore = new Firestore({
  projectId: "tekktekk-notes",
  keyFilename: "private/keys/firestore-development.json",
})

const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

export function dataWithID(doc: DocumentSnapshot): DocumentData | undefined {
  const data = doc.data()
  return data ? { ...data, id: doc.id } : undefined
}
