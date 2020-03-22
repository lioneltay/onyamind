import { resetDB } from "../utils"

describe("Intialization", function() {
  beforeEach(() => {
    return resetDB()
  })

  it("Initialize the anonymous user and create first 'Todo' list", () => {
    cy.visit("/")

    cy.findByText(/todo/i)
  })

  it("Clicking menu opens drawer", () => {
    cy.visit("/")

    cy.findByTestId("menu-button").click()

    cy.findByText(/primary list/i)

    cy.findByTestId("close-drawer-button").click()

    cy.findByText(/primary list/i).should("not.exist")

    cy.findByTestId("close-drawer-button").should("not.exist")
  })

  it("Can create a task", () => {
    cy.visit("/")

    cy.findByText(/todo/i)

    cy.findByPlaceholderText(/add item/i)
      .click()
      .type("hello\n")
  })
})
