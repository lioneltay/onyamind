describe("Intialization", function() {
  it("Initialize the anonymous user and create first 'Todo' list", () => {
    cy.visit("/")

    cy.findByText(/todo/i)
  })

  it("Clicking menu opens drawer", () => {
    cy.visit("/")

    cy.findByTestId("menu-button").click()

    cy.findByTestId(/primary list/i)
  })
})
