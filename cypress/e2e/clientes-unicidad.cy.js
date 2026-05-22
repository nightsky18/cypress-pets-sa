import { getCaseFromSheet, getLocator } from '../support/xlsx-helper';

describe('Clientes - unicidad de cédula', () => {
  it('C-I-01 - no debe permitir registrar un cliente con cédula duplicada', () => {
    getCaseFromSheet('ESC03_UNICIDAD', 'C-I-01').then((caso) => {
      cy.login('admin');

      cy.visit('/clientes/');

      cy.contains('Nuevo').click();

      cy.get(getLocator(caso.campo_f1_locator)).should('be.visible').clear().type(String(caso.cedula).replace('.0', ''));
      cy.get(getLocator(caso.campo_f2_locator)).should('be.visible').clear().type(caso.nombres);
      cy.get(getLocator(caso.campo_f3_locator)).should('be.visible').clear().type(caso.apellidos);
      cy.get(getLocator(caso.campo_f4_locator)).should('be.visible').clear().type(String(caso.telefono).replace('.0', ''));
      cy.get(getLocator(caso.campo_f5_locator)).should('be.visible').clear().type(caso.direccion);

      cy.get(getLocator(caso.campo_submit_locator)).should('be.visible').click();

      cy.get(getLocator(caso.campo_error_locator))
        .should('be.visible')
        .and('contain', caso.expected_error_text);
    });
  });
});