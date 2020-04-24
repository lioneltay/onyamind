import { resetDB, visitListPage } from "../utils"

beforeEach(() => {
  return resetDB()
})

function createTask(title) {
  cy.findByPlaceholderText(/add task/i)
    .click()
    .type(`${title}\n`)
}

function selectTask(position) {
  cy.findAllByIconName("assignment").then((items) =>
    cy.wrap(items[position - 1]).click(),
  )
}

it("Tasks remain in order when created", () => {
  visitListPage()

  const tasks = 4

  for (let i = 0; i < tasks; i++) {
    createTask(`newtask ${i}`)
  }

  cy.findAllByText(/newtask/).each((value, index) => {
    expect(value).to.have.text(`newtask ${tasks - 1 - index}`)
  })
})
