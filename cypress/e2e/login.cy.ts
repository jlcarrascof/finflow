describe('Flujo de Autenticación', () => {
  it('Debería permitir al administrador iniciar sesión y ver el Dashboard', () => {
    // 1. El robot entra a la página principal
    cy.visit('/')

    // 2. El robot busca el campo de email y escribe
    cy.get('input[type="email"]').type('admin@finflow.dev')

    // 3. El robot busca el campo de contraseña y escribe
    cy.get('input[type="password"]').type('admin123')

    // 4. El robot hace clic en el botón de Iniciar Sesión
    cy.get('button[type="submit"]').click()

    // 5. El robot verifica que entramos al sistema correctamente
    cy.url().should('include', '/')
    cy.contains('Resumen Financiero').should('be.visible')
  })
})