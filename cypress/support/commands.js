Cypress.Commands.add('login', (role = 'admin') => {
  const users = {
    admin: {
      user: Cypress.env('ADMIN_USER'),
      pass: Cypress.env('ADMIN_PASS'),
    },
    veterinario: {
      user: Cypress.env('VET_USER'),
      pass: Cypress.env('VET_PASS'),
    },
    recepcion: {
      user: Cypress.env('RECEP_USER'),
      pass: Cypress.env('RECEP_PASS'),
    },
    bloqueo: {
      user: Cypress.env('BLOQ_USER'),
      pass: Cypress.env('BLOQ_PASS'),
    },
  };

  if (!users[role]) {
    throw new Error(`Rol no válido: ${role}`);
  }

  const { user, pass } = users[role];

  if (!user || !pass) {
    throw new Error(`Faltan credenciales para el rol: ${role}`);
  }

  cy.visit('/', { timeout: 90000 });

  cy.get('#id_username', { timeout: 20000 }).should('be.visible').clear().type(user);
  cy.get('#id_password', { timeout: 20000 }).should('be.visible').clear().type(pass, { log: false });
  cy.get('button[type="submit"]', { timeout: 20000 }).should('be.visible').click();

  cy.get("a[href='/logout/']", { timeout: 20000 }).should('be.visible');
  cy.get('div.nav-left', { timeout: 20000 }).should('be.visible');
});