describe("Intialization", function() {
  it("Initialize the anonymous user and create first 'Todo' list", () => {
    cy.visit("/").findByText(/todo/i)
  })
})
