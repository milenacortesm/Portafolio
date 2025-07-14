const { beforeEach } = require("mocha");

describe('Módulo: Login', () => {




    it('L01 - Login con credenciales válidas ', () => {
        /*cy.visit('/')
        cy.get('[name="username"]').type('Admin')
        cy.get('[name="password"]').type('admin123')
        cy.get('[type="submit"]').click()*/
        cy.login('Admin', 'admin123')
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain.text', 'Dashboard')

    });


    it('L02 - Login con usuario inválido', () => {
        cy.login('Admin1', 'admin123')
        cy.get('[role="alert"]').should('exist')
            .should('contain.text', 'Invalid credentials')
    });


    it('L03 - Login con contraseña inválida', () => {
        cy.login('Admin', 'admin1234')
        cy.get('[role="alert"]').should('exist')
            .should('contain.text', 'Invalid credentials')
    });


    it('L04 - Login con campos vacíos', () => {
        cy.visit('/')
        cy.get('[type="submit"]').click()
        // Validamos los mensajes de error
        cy.get('span.oxd-input-field-error-message')
            .should('contain', 'Required')
            .and('have.length', 2) // uno para usuario, otro para password
    });

    it('L05 - Logout exitoso desde dashboard', () => {
        cy.login('Admin', 'admin123')
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain.text', 'Dashboard')
        cy.get('.oxd-userdropdown-name').click()
        cy.get('.oxd-userdropdown-link').contains('Logout').click()

        /*cy.contains('Login') // verifica que el texto 'Login' esté en la pantalla
        cy.get('input[name="username"]').should('be.visible')
        cy.get('input[name="password"]').should('be.visible')*/

        // Verifica que volvió al login
        cy.url().should('include', '/auth/login')




    });
})