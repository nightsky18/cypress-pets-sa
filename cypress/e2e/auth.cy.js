describe('Autenticación PETS S.A.', () => {
  it('AUTH - Login válido como admin', () => {
    cy.login('admin');
    cy.get("a[href='/logout/']").should('be.visible');
    cy.get('div.nav-left').should('be.visible');
  });

  it('AUTH - Login válido como veterinario', () => {
    cy.login('veterinario');
    cy.get("a[href='/logout/']").should('be.visible');
    cy.get('div.nav-left').should('be.visible');
  });

  it('AUTH - Login válido como recepcionista', () => {
    cy.login('recepcion');
    cy.get("a[href='/logout/']").should('be.visible');
    cy.get('div.nav-left').should('be.visible');
  });

  it('AUTH - Bloqueo por intentos fallidos', () => {
    cy.visit('/');
    cy.get('#id_username').type(Cypress.env('BLOQ_USER'));
    cy.get('#id_password').type('WrongPass1!', { log: false });
    cy.get('button[type="submit"]').click();

    cy.get('#id_password').clear().type('WrongPass2!', { log: false });
    cy.get('button[type="submit"]').click();

    cy.get('#id_password').clear().type('WrongPass3!', { log: false });
    cy.get('button[type="submit"]').click();

    cy.contains(/bloqueado|contacta al administrador/i).should('be.visible');
  });
});