import { getCaseFromSheet, getLocator } from '../support/xlsx-helper';

describe('Medicamentos - validaciones de seguridad', () => {
  it('MED-I-03 - no debe aceptar XSS o SQLi en medicamentos', () => {
    getCaseFromSheet('ESC01_XSS_SQLI', 'MED-I-03').then((caso) => {
      cy.login('admin');

      cy.visit('/medicamentos/');
      cy.contains('Nuevo').click();

      cy.get(getLocator(caso.campo_f1_locator))
        .should('be.visible')
        .clear()
        .type(caso.med_nombre);

      cy.get(getLocator(caso.campo_f2_locator))
        .should('be.visible')
        .clear()
        .type(caso.med_descripcion);

      cy.get(getLocator(caso.campo_f3_locator))
        .should('be.visible')
        .clear()
        .type(caso.med_dosis);

      cy.get(getLocator(caso.campo_submit_locator))
        .should('be.visible')
        .click();

      cy.url().then((url) => {
        if (caso.campo_error_locator) {
          cy.get(getLocator(caso.campo_error_locator)).should('be.visible');
        } else {
          cy.get(getLocator(caso.campo_listado_locator)).should('not.contain', caso.med_nombre);
        }
      });
    });
  });
});