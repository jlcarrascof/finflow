describe('FinFlow Core E2E Suite', () => {

  // ─── SETUP (Equivalente a instanciar tu LoginPage en POM) ─────────────
  // Este bloque se ejecuta automáticamente ANTES de cada test (it)
  beforeEach(() => {
    // 1. Estado inicial
    cy.visit('/')
    
    // 2. Acciones del Page Object
    cy.get('input[type="email"]').type('admin@finflow.dev')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // 3. Aserción de éxito del login (Garantiza que el test no empiece hasta que el dashboard cargue)
    cy.contains('Resumen Financiero').should('be.visible')
  })

  // ─── TEST 1: Navegación entre Módulos ──────────────────────────────────
  it('Debería navegar fluidamente entre los módulos de Facturas y Gastos', () => {
    // A diferencia de Selenium, Cypress espera implícitamente a que los elementos 
    // aparezcan en el DOM, no necesitas escribir explícitamente "WebDriverWait".

    // 1. Click en la pestaña de Facturas del Navbar superior
    cy.contains('Facturas').click()
    
    // 2. Validar que el componente InvoiceList.vue se montó correctamente
    cy.get('h2').contains('Facturación').should('be.visible')
    
    // 3. Validar que la tabla trajo datos de la base de datos (PostgreSQL real)
    cy.contains('FAC-0000001').should('be.visible')

    // 4. Click en la pestaña de Gastos
    cy.contains('Gastos').click()
    
    // 5. Validar que la URL y la vista cambiaron
    cy.url().should('include', '/gastos') // Ajusta la ruta si es diferente en tu vue-router
  })

  // ─── TEST 2: Flujo Completo de Auditoría y Cierre de Sesión ────────────
  it('Debería permitir ingresar, revisar la facturación y cerrar sesión de forma segura', () => {
    // 1. Ir directamente a revisar las facturas
    cy.contains('Facturas').click()
    cy.get('h2').contains('Facturación').should('be.visible')

    // 2. Hacer clic en el botón rojo de Logout del Navbar
    cy.contains('Cerrar sesión').click()

    // 3. Validar la redirección y limpieza de sesión
    // Nos aseguramos de que el formulario de login volvió a aparecer
    cy.get('input[type="email"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    
    // 4. Garantizar que el usuario fue expulsado del dashboard
    cy.contains('Resumen Financiero').should('not.exist')
  })
})