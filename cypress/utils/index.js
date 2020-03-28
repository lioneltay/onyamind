import axios from "axios"

export const resetDB = () => {
  // Delete firestore emulator data
  return axios.delete(
    "http://localhost:8080/emulator/v1/projects/onyamind-staging/databases/(default)/documents",
  )
}
