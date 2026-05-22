import { getCaseFromSheet } from '../support/xlsx-helper';

const casos = [
  'ACC-VET-CLI',
  'ACC-REC-MED',
  'ACC-REC-USR',
  'ACC-VET-USR',
];

describe('Acceso por rol desde dataset', () => {
  casos.forEach((idCaso) => {
    it(`${idCaso} - debe denegar acceso al módulo restringido`, () => {
      getCaseFromSheet('ESC02_ACCESO', idCaso).then((caso) => {
        cy.visit('/');
        cy.get('#id_username').should('be.visible').clear().type(caso.username);
        cy.get('#id_password').should('be.visible').clear().type(caso.password, { log: false });
        cy.get('button[type="submit"]').should('be.visible').click();

        cy.url().should('not.include', '/login/');
        cy.visit(caso.campo_url_target);

        cy.url().should('include', caso.campo_url_denied);
        cy.contains(caso.expected_error_text).should('be.visible');
      });
    });
  });
});