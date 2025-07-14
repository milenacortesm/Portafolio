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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (user, password) => { 
    cy.visit('/')
    cy.get('[name="username"]').type(user)
    cy.get('[name="password"]').type(password)
    cy.get('[type="submit"]').click()
})

//crear nombre, apellido y usuario para los empleados
Cypress.Commands.add('crearUsuarioEmpleado', () => {
    const firstName = faker.person.firstName()
    const middleName = faker.person.middleName()
    const lastName = faker.person.lastName()
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`
 
})


