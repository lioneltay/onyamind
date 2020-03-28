import axios from "axios"

export const resetDB = () => {
  // Delete firestore emulator data
  return axios.delete(
    "http://localhost:8080/emulator/v1/projects/onyamind-staging/databases/(default)/documents",
  )
}

export function visitListPage(listInfo) {
  if (listInfo && listInfo.id) {
    cy.visit(`lists/${listInfo.id}`)
    cy.findByText(new RegExp(`${listInfo.name}`, "i"))
  } else {
    cy.visit("/lists")
    cy.findByText(/todo/i)
  }
}
