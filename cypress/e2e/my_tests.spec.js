import { resetDB } from "../utils"

beforeEach(() => {
  return resetDB()
})

it("Initialize the anonymous user create first 'Todo' list and redirect", () => {
  cy.visit("/")

  cy.findByText(/todo/i)

  cy.url().should("include", "/lists/")
})

it("Clicking menu opens drawer", () => {
  cy.visit("/")

  cy.findByTestId("open-drawer-button").click()

  cy.findByText(/primary list/i)

  cy.findByTestId("close-drawer-button").click()

  cy.findByText(/primary list/i).should("not.exist")

  cy.findByTestId("close-drawer-button").should("not.exist")
})

it("Can create a task by pressing enter", () => {
  cy.visit("/")

  // Ensure that task list is loaded
  cy.findByText(/todo/i)

  cy.findByPlaceholderText(/add item/i)
    .click()
    .type("Created by pressing enter\n")
})

it("Can create a task by clicking button with notes", () => {
  cy.visit("/")

  cy.findByText(/todo/i)

  const title = "Created by pressing '+' button"
  const notes = "Notes created in modal"

  cy.findByTestId("add-task-button").click()
  cy.findByTestId("modal").findByPlaceholderText(/task/i).click().type(title)
  cy.findByTestId("modal").findByPlaceholderText(/notes/i).click().type(notes)
  cy.findByTestId("modal").findByText(/save/i).click()

  cy.findAllByText(title)
  cy.findAllByText(notes)
})

// TODO for some reason the firestore emulator can't connect to functions emulator in cypress browser..?
it.skip("TaskList count remains in sync when operating on tasks", () => {
  cy.visit("/")

  function checkCounts(pattern) {
    cy.findByTestId("open-drawer-button").click()
    cy.findByText(pattern)
    cy.findByTestId("close-drawer-button").click()
  }

  checkCounts(/no tasks/i)

  cy.findByPlaceholderText(/add item/i)
    .click()
    .type("Task1\n")

  checkCounts(/no tasks/i)
})
