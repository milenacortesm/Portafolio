import { el, faker } from '@faker-js/faker'


describe('Employee Management)', () => {


    beforeEach(() => {
        cy.login('Admin', 'admin123')
    });

    it.only('P01 - Add new employee', () => {

        const employee = generateEmployeeBasicData()
        const passwordD = generateDynamicPassword()


        cy.get(':nth-child(2) > .oxd-main-menu-item').click()
        cy.get('.orangehrm-header-container > .oxd-button').click()
        cy.url().should('include', '/addEmployee')
        cy.get('.--name-grouped-field > :nth-child(1) > :nth-child(2) > .oxd-input').type(employee.firstName)
        cy.get(':nth-child(2) > :nth-child(2) > .oxd-input').type(employee.middleName)
        cy.get(':nth-child(3) > :nth-child(2) > .oxd-input').type(employee.lastName)

        cy.get('.oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input').invoke('val').then((valor) => {
            employee.id = valor
        })

        cy.get('.oxd-switch-input').click()

        //add more details
        cy.get(':nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input').type(employee.username)
        cy.get('.user-password-cell > .oxd-input-group > :nth-child(2) > .oxd-input').type(passwordD)
        cy.get('.oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type(passwordD)
        cy.get('.oxd-button--secondary').click()

        //confirmation
        cy.get('.oxd-toast').should('contain', 'Successfully Saved')
        cy.get('.orangehrm-edit-employee-content > :nth-child(1) > .oxd-text--h6', { timeout: 10000 })
            .should('contain', 'Personal Details')


        // Guarda el empleado en archivo JSON
        cy.readFile('cypress/fixtures/employee.json', { log: false }).then((data) => {
            const employees = Array.isArray(data) ? data : []
            employees.push(employee)
            cy.writeFile('cypress/fixtures/employee.json', employees)
        })
    })


    it('P02 - Search for non existing employee', () => {
        cy.get(':nth-child(2) > .oxd-main-menu-item').click()
        cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-autocomplete-wrapper > .oxd-autocomplete-text-input > input').type('Zero')

        cy.get('.oxd-form-actions > .oxd-button--secondary').click()
        cy.get('.oxd-text--toast-message').should('contain', 'No Records Found')
    })

    it('P03 - Editar empleado existente', () => {

    });

    it('P04 - Delete the first employee', () => {
        cy.get(':nth-child(2) > .oxd-main-menu-item').click()

        cy.get('.oxd-table-row--clickable')           // todas las filas
            .first()                                    // primera fila
            .find('.oxd-table-cell')                    // todas las celdas de esa fila
            .last()                                     // última celda (acciones)
            .find('button').last()                             // botón de acciones (⋮)
            .click()

        // Espera y hace clic en "Delete"
        cy.get('.oxd-sheet')
            .contains(' Yes, Delete ')
            .click()


        // Validar que la eliminación fue exitosa
        cy.get('.oxd-toast').should('contain', 'Successfully Deleted')
    });


    it.only('P05 - Delete employee by searching for Name', () => {
        cy.get(':nth-child(2) > .oxd-main-menu-item').click()

        getEmployeeData('firstName').then((name) => {
            cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-autocomplete-wrapper > .oxd-autocomplete-text-input > input').type(name)

            // Esperar que se cargue el dropdown y seleccionar la primera opción visible
            cy.get('.oxd-autocomplete-option', { timeout: 5000 })
                .should('be.visible') // asegura que esté abierto
                .first()
                .click()
            cy.get('.oxd-form-actions > .oxd-button--secondary').click()
            cy.wait(2000)
            cy.get('.oxd-table-row--clickable')           // todas las filas
                .first()                                    // primera fila
                .find('.oxd-table-cell')                    // todas las celdas de esa fila
                .last()                                     // última celda (acciones)
                .find('button').last()                             // botón de acciones (⋮)
                .click()

            // Espera y hace clic en "Delete"
            cy.get('.oxd-sheet')
                .contains(' Yes, Delete ')
                .click()


            // // Validar que la eliminación fue exitosa
            cy.get('.oxd-toast').should('contain', 'Successfully Deleted')
            deleteEmployeeFromJson(name)
        })
    });


    //this code just finds the first 50 rows
    it('P05 - Delete employee by Name', () => {

        getEmployeeData('firstName').then((name) => {
            cy.log('name_' + name)

            //const nombreEmpleado = 'Karla Smith' // o puedes traerlo desde tu JSON

            cy.get(':nth-child(2) > .oxd-main-menu-item').click()

            // Espera que la tabla esté cargada
            cy.get('.oxd-table-row--clickable').should('exist')
            cy.pause()
            // Buscar fila que contenga el nombre y eliminar
            cy.get('.oxd-table-row--clickable').each(($fila) => {
                cy.wrap($fila).find('.oxd-table-cell').eq(1).then(($celdaNombre) => {
                    if ($celdaNombre.text().includes(name)) {

                        // Hacer clic en el botón de acciones en la última celda
                        cy.wrap($fila)
                            .find('.oxd-table-cell')
                            .last()
                            .find('button')
                            .last()
                            .click()

                        // Click en "Delete"
                        cy.get('.oxd-dropdown-menu').contains('Delete').click()

                        // Confirmar
                        cy.get('.oxd-sheet').contains(' Yes, Delete ').click()

                        // Validar éxito
                        cy.get('.oxd-toast').should('contain', 'Successfully Deleted')
                    }
                })
            })

        })


    });

    it('P05 - Validar campos requeridos', () => {

    });

    it('P06 - Search existing employee by Name', () => {
        getEmployeeData('firstName').then((valor) => {
            cy.get(':nth-child(2) > .oxd-main-menu-item').click()
            cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-autocomplete-wrapper > .oxd-autocomplete-text-input > input').type(valor)


            // Esperar que se cargue el dropdown y seleccionar la primera opción visible
            cy.get('.oxd-autocomplete-option', { timeout: 5000 })
                .should('be.visible') // asegura que esté abierto
                .first()
                .click()
            cy.get('.oxd-form-actions > .oxd-button--secondary').click()
            cy.get('[class="oxd-table-row oxd-table-row--with-border oxd-table-row--clickable"]').should('contain', valor)
        })

    })

    it('P07 - Search existing employee by ID', () => {

        getEmployeeData('id').then((valor) => {
            cy.get(':nth-child(2) > .oxd-main-menu-item').click()
            cy.get(':nth-child(2) > .oxd-input').type(valor)

            cy.get('.oxd-form-actions > .oxd-button--secondary').click()
            cy.get('[class="oxd-table-row oxd-table-row--with-border oxd-table-row--clickable"]').should('contain', valor)
        })

    })




})



export function generateEmployeeBasicData() {
    const firstName = faker.person.firstName()
    const middleName = faker.person.middleName()
    const lastName = faker.person.lastName()
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}`
    const id = ''

    return { firstName, middleName, lastName, username, id }
}



export function generateDynamicPassword(longitud = 8) {
    const mayus = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const minus = 'abcdefghijklmnopqrstuvwxyz'
    const numeros = '0123456789'
    const simbolos = '!@#$%^&*()_+{}[]<>?'

    const todo = mayus + minus + numeros + simbolos

    let password = ''

    // Al menos un carácter de cada tipo
    password += mayus[Math.floor(Math.random() * mayus.length)]
    password += minus[Math.floor(Math.random() * minus.length)]
    password += numeros[Math.floor(Math.random() * numeros.length)]
    password += simbolos[Math.floor(Math.random() * simbolos.length)]

    // Completa el resto al azar
    for (let i = 4; i < longitud; i++) {
        password += todo[Math.floor(Math.random() * todo.length)]
    }

    // Mezclar los caracteres
    return password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')
}

export function getEmployeeData(field) {
    return cy.fixture('employee.json').then((employeesList) => {
        if (!Array.isArray(employeesList) || employeesList.length === 0) {
            throw new Error('No hay empleados disponibles en el JSON')
        }

        var index = 0
        const employee = employeesList[index]
        const value = employee[field]


        if (value === undefined) {
            throw new Error(`El campo "${field}" no existe en el empleado`)
        }

        return value
    })
}


export function deleteEmployeeFromJson(nombreCompleto) {
    cy.readFile('cypress/fixtures/employee.json').then((empleados) => {
      if (!Array.isArray(empleados)) {
        throw new Error('El archivo employee.json no contiene un array válido.')
      }
  
      const listaActualizada = empleados.filter(emp => {
        const nombre = `${emp.firstName} ${emp.lastName}`
        return nombre !== nombreCompleto
      })
  
      cy.writeFile('cypress/fixtures/employee.json', listaActualizada)
    })
  }
  