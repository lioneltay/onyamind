import {
  Firestore,
  DocumentSnapshot,
  DocumentData,
} from "@google-cloud/firestore"

const config =
  process.env.APP_MODE === "development"
    ? {
        projectId: "tekktekk-notes",
        keyFilename: "private/keys/firestore-development.json",
      }
    : process.env.APP_MODE === "production"
    ? {
        projectId: "tekktekk-notes",
      }
    : undefined

export const firestore = new Firestore(config)

const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

export function dataWithID(doc: DocumentSnapshot): DocumentData | undefined {
  const data = doc.data()
  return data ? { ...data, id: doc.id } : undefined
}
