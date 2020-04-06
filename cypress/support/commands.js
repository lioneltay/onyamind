// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
  "findByIconName",
  {
    prevSubject: "optional",
  },
  (subject, iconName) => {
    const log = (message) =>
      Cypress.log({
        name: "findByIconName",
        displayName: "findByIconName",
        message,
      })

    if (subject) {
      return cy.wrap(subject).within(() => {
        log(iconName)
        cy.get(`[data-icon-name=${iconName}]`, { log: false })
      })
    } else {
      log(iconName)
      return cy.get(`[data-icon-name=${iconName}]`, { log: false })
    }
  },
)

Cypress.Commands.add(
  "findAllByIconName",
  {
    prevSubject: "optional",
  },
  (subject, iconName) => {
    const log = (message) =>
      Cypress.log({
        name: "findAllByIconName",
        displayName: "findAllByIconName",
        message,
      })

    if (subject) {
      return cy.wrap(subject).within(() => {
        log(iconName)
        cy.get(`[data-icon-name=${iconName}]`, { log: false })
      })
    } else {
      log(iconName)
      return cy.get(`[data-icon-name=${iconName}]`, { log: false })
    }
  },
)
