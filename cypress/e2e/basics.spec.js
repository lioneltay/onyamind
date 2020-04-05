import { resetDB, visitListPage } from "../utils"

beforeEach(() => {
  return resetDB()
})

it("Initialize the anonymous user create first 'Todo' list and redirect", () => {
  visitListPage()

  cy.url().should("include", "/lists/")
})

it("Clicking menu opens drawer", () => {
  cy.visit("/")

  cy.findByIconName("menu").click()

  cy.findByText(/primary list/i)

  cy.findByIconName("clear").click()

  cy.findByText(/primary list/i).should("not.exist")

  cy.findByIconName("clear").should("not.exist")
})

it("Can create a task by pressing enter", () => {
  visitListPage()

  cy.findByPlaceholderText(/add item/i)
    .click()
    .type("Created by pressing enter\n")
})

it("Can create a task by clicking button with notes", () => {
  visitListPage()

  const title = "Created by pressing '+' button"
  const notes = "Notes created in modal"

  cy.findByIconName("add").click()
  cy.findByTestId("modal").findByPlaceholderText(/task/i).click().type(title)
  cy.findByTestId("modal").findByPlaceholderText(/notes/i).click().type(notes)
  cy.findByTestId("modal").findByText(/save/i).click()

  cy.findAllByText(title)
  cy.findAllByText(notes)
})
