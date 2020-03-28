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

  cy.findByTestId("menu").click()

  cy.findByText(/primary list/i)

  cy.findByTestId("clear").click()

  cy.findByText(/primary list/i).should("not.exist")

  cy.findByTestId("clear").should("not.exist")
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

// function checkCounts(incomplete, complete) {
//   cy.findByTestId("menu").click()
//   if (incomplete + complete === 0) {
//     cy.findByText(/no tasks/i)
//   } else {
//     cy.findByText(new RegExp(`${complete}\/${incomplete + complete}`))
//   }
//   cy.findByTestId("clear").click()
// }

// function selectTask(position) {
//   cy.findAllByTestId("assignment").then((items) =>
//     cy.wrap(items[position - 1]).click(),
//   )
// }

// it("TaskList count remains in sync when operating on tasks create/check/uncheck/delete-checked/delete-unchecked", () => {
//   cy.visit("/")

//   checkCounts(0, 0)

//   // Create
//   cy.findByPlaceholderText(/add item/i)
//     .click()
//     .type("Task1\n")
//   checkCounts(1, 0)

//   // Create
//   cy.findByPlaceholderText(/add item/i)
//     .click()
//     .type("Task2\n")
//   checkCounts(2, 0)

//   // Create
//   cy.findByPlaceholderText(/add item/i)
//     .click()
//     .type("Task3\n")
//   checkCounts(3, 0)

//   // Check
//   selectTask(1)
//   cy.get("header").findByTestId("check").click()
//   checkCounts(2, 1)

//   // Check
//   cy.findByText(/checked off/i).click()
//   selectTask(2)
//   cy.get("header").findByTestId("check").click()
//   checkCounts(1, 2)

//   // Uncheck
//   selectTask(3)
//   cy.get("header").findByTestId("add").click()
//   checkCounts(2, 1)

//   // Delete unchecked
//   selectTask(1)
//   cy.get("header").findByTestId("delete").click()
//   checkCounts(1, 1)

//   // Delete checked
//   selectTask(2)
//   cy.get("header").findByTestId("delete").click()
//   checkCounts(1, 0)
// })

// it("TaskList count remains in sync when operating on tasks move-checked/move-unchecked", () => {
//   cy.visit("/")
//   cy.findByText(/todo/i)

//   // Create
//   cy.findByPlaceholderText(/add item/i)
//     .click()
//     .type("Task1\n")

//   // Create
//   cy.findByPlaceholderText(/add item/i)
//     .click()
//     .type("Task2\n")

//   // Check
//   selectTask(1)
//   cy.get("header").findByTestId("check").click()

//   // Create List
//   const listName = "xlistx"
//   cy.findByTestId("menu").click()
//   cy.findByText(/create new list/i).click()
//   cy.findByPlaceholderText(/name/i).type(listName)
//   cy.findByTestId("modal")
//     .findByText(/create/i, { selector: "button *" })
//     .click()
//   cy.findByText(listName)
//   cy.findByTestId("clear").click()

//   // Move checked
//   checkCounts(1, 1)
//   selectTask(1)
//   cy.get("header").findByTestId("swaphoriz").click()
//   cy.findByRole("menu").findByText(listName).click()
//   checkCounts(0, 1)

//   // Move unchecked
//   cy.findByText(/checked off/i).click()
//   selectTask(1)
//   cy.get("header").findByTestId("swaphoriz").click()
//   cy.findByRole("menu").findByText(listName).click()
//   checkCounts(0, 0)
// })
