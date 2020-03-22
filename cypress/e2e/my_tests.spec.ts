describe("Intialization", function() {
  it("Initialize the anonymous user and create first 'Todo' list", () => {
    cy.visit("/").get(
      ".HeaderBase___StyledDiv2-sc-175njhs-2 > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root > path",
    )
    .click()
  })
})
