import { getCaseFromSheet } from '../support/xlsx-helper';

describe('Acceso por dataset XLSX', () => {
  it('valida acceso denegado a clientes para veterinario', () => {
    getCaseFromSheet('ESC02_ACCESO', 'ACC-VET-CLI').then((caso) => {
      cy.visit('/');
      cy.get('#id_username').type(caso.username);
      cy.get('#id_password').type(caso.password, { log: false });
      cy.get('button[type="submit"]').click();

      cy.visit(caso.campo_url_target);
      cy.url().should('include', caso.campo_url_denied);
      cy.contains(caso.expected_error_text).should('be.visible');
    });
  });
});