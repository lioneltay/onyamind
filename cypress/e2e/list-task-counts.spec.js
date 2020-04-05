// import { resetDB, visitListPage } from "../utils"

// function checkCounts(incomplete, complete) {
//   cy.findByIconName("menu").click()
//   if (incomplete + complete === 0) {
//     cy.findByText(/no tasks/i)
//   } else {
//     cy.findByText(new RegExp(`${complete}\/${incomplete + complete}`))
//   }
//   cy.findByIconName("clear").click()
// }

// function selectTask(position) {
//   cy.findAllByIconName("assignment").then((items) =>
//     cy.wrap(items[position - 1]).click(),
//   )
// }

// beforeEach(() => {
//   return resetDB()
// })

// it("TaskList count remains in sync when operating on tasks create/check/uncheck/delete-checked/delete-unchecked", () => {
//   visitListPage()

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
//   cy.get("header").findByIconName("check").click()
//   checkCounts(2, 1)

//   // Check
//   cy.findByText(/checked off/i).click()
//   selectTask(2)
//   cy.get("header").findByIconName("check").click()
//   checkCounts(1, 2)

//   // Uncheck
//   selectTask(3)
//   cy.get("header").findByIconName("add").click()
//   checkCounts(2, 1)

//   // Delete unchecked
//   selectTask(1)
//   cy.get("header").findByIconName("delete").click()
//   checkCounts(1, 1)

//   // Delete checked
//   selectTask(2)
//   cy.get("header").findByIconName("delete").click()
//   checkCounts(1, 0)
// })

// it("TaskList count remains in sync when operating on tasks move-checked/move-unchecked", () => {
//   visitListPage()

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
//   cy.get("header").findByIconName("check").click()

//   // Create List
//   const listName = "xlistx"
//   cy.findByIconName("menu").click()
//   cy.findByText(/create new list/i).click()
//   cy.findByPlaceholderText(/name/i).type(listName)
//   cy.findByTestId("modal")
//     .findByText(/create/i, { selector: "button *" })
//     .click()
//   cy.findByText(listName)
//   cy.findByIconName("clear").click()

//   // Move checked
//   checkCounts(1, 1)
//   selectTask(1)
//   cy.get("header").findByIconName("swaphoriz").click()
//   cy.findByRole("menu").findByText(listName).click()
//   checkCounts(0, 1)

//   // Move unchecked
//   cy.findByText(/checked off/i).click()
//   selectTask(1)
//   cy.get("header").findByIconName("swaphoriz").click()
//   cy.findByRole("menu").findByText(listName).click()
//   checkCounts(0, 0)
// })
