import { getCaseFromSheet, getLocator } from '../support/xlsx-helper';

const SHEET = 'ESC05_CRUD_MASC';
const SHEET_UNI = 'ESC03_UNICIDAD';
const FILE = 'cypress/testdata/Dataset-Escenarios-PETS-SA.xlsx';

function cleanNum(val) {
  return String(val).replace('.0', '');
}

describe('Mascotas - CRUD completo', () => {

  it('M-V-01 - debe crear una mascota válida', () => {
    getCaseFromSheet(SHEET, 'M-V-01').then((caso) => {
      cy.login('admin');

      cy.visit('/mascotas/');
      cy.contains('Nuevo').click();

      cy.get(getLocator(caso.campo_id_locator))
        .should('be.visible').clear().type(caso.pet_id);

      cy.get(getLocator(caso.campo_nombre_locator))
        .should('be.visible').clear().type(caso.nombre);

      cy.get(getLocator(caso.campo_raza_locator))
        .should('be.visible').clear().type(caso.raza);

      cy.get(getLocator(caso.campo_edad_locator))
        .should('be.visible').clear().type(cleanNum(caso.edad));

      cy.get(getLocator(caso.campo_peso_locator))
        .should('be.visible').clear().type(String(caso.peso));

      cy.get(getLocator(caso.campo_medicamento_locator))
        .should('be.visible').select(caso.medicamento_id);

      cy.get(getLocator(caso.campo_cliente_locator))
        .should('be.visible').select(caso.cliente_id);

      cy.get(getLocator(caso.campo_submit_locator))
        .should('be.visible').click();

      cy.get(getLocator(caso.campo_listado_locator))
        .should('contain', caso.campo_row_search_text);
    });
  });

  it('M-EDIT-01 - debe editar una mascota existente', () => {
    getCaseFromSheet(SHEET, 'M-EDIT-01').then((caso) => {
      cy.login('admin');

      cy.visit('/mascotas/');

      cy.get(getLocator(caso.campo_listado_locator))
        .contains(caso.campo_row_search_text)
        .parents('tr')
        .find(getLocator(caso.campo_edit_btn_locator))
        .first()
        .click();

      cy.get(getLocator(caso.campo_nombre_locator))
        .should('be.visible').clear().type(caso.nombre);

      cy.get(getLocator(caso.campo_raza_locator))
        .should('be.visible').clear().type(caso.raza);

      cy.get(getLocator(caso.campo_edad_locator))
        .should('be.visible').clear().type(cleanNum(caso.edad));

      cy.get(getLocator(caso.campo_peso_locator))
        .should('be.visible').clear().type(String(caso.peso));

      cy.get(getLocator(caso.campo_medicamento_locator))
        .should('be.visible').select(caso.medicamento_id);

      cy.get(getLocator(caso.campo_cliente_locator))
        .should('be.visible').select(caso.cliente_id);

      cy.get(getLocator(caso.campo_submit_locator))
        .should('be.visible').click();

      cy.get(getLocator(caso.campo_listado_locator))
        .should('contain', caso.nombre);
    });
  });

  it('M-DEL-01 - debe eliminar una mascota y desaparecer del listado', () => {
    getCaseFromSheet(SHEET, 'M-DEL-01').then((caso) => {
      cy.login('admin');

      cy.visit('/mascotas/');

      cy.get(getLocator(caso.campo_listado_locator))
        .contains(caso.campo_row_search_text)
        .parents('tr')
        .find(getLocator(caso.campo_del_btn_locator))
        .first()
        .click();

      cy.get(getLocator(caso.campo_confirm_del_locator))
        .should('be.visible').click();

      cy.get(getLocator(caso.campo_listado_locator))
        .should('not.contain', caso.campo_row_search_text);
    });
  });

  it('M-I-01 - no debe permitir crear mascota con ID duplicado', () => {
    getCaseFromSheet(SHEET_UNI, 'M-I-01').then((caso) => {
      cy.login('admin');

      cy.visit('/mascotas/');
      cy.contains('Nuevo').click();

      cy.get(getLocator(caso.campo_f1_locator))
        .should('be.visible').clear().type(caso.pet_id);

      cy.get(getLocator(caso.campo_f2_locator))
        .should('be.visible').clear().type(caso.nombre_mascota);

      cy.get(getLocator(caso.campo_f3_locator))
        .should('be.visible').clear().type(caso.raza);

      cy.get(getLocator(caso.campo_f4_locator))
        .should('be.visible').clear().type(cleanNum(caso.edad));

      cy.get(getLocator(caso.campo_f5_locator))
        .should('be.visible').clear().type(String(caso.peso));

      cy.get(getLocator(caso.campo_cliente_locator))
        .should('be.visible').select(caso.cliente_id);

      cy.get(getLocator(caso.campo_submit_locator))
        .should('be.visible').click();

      cy.get(getLocator(caso.campo_error_locator))
        .should('be.visible')
        .and('contain', caso.expected_error_text);
    });
  });

  it('M-I-02 - no debe aceptar peso negativo', () => {
    getCaseFromSheet(SHEET, 'M-I-02').then((caso) => {
      cy.login('admin');

      cy.visit('/mascotas/');
      cy.contains('Nuevo').click();

      cy.get(getLocator(caso.campo_id_locator))
        .should('be.visible').clear().type(caso.pet_id);

      cy.get(getLocator(caso.campo_nombre_locator))
        .should('be.visible').clear().type(caso.nombre);

      cy.get(getLocator(caso.campo_raza_locator))
        .should('be.visible').clear().type(caso.raza);

      cy.get(getLocator(caso.campo_edad_locator))
        .should('be.visible').clear().type(cleanNum(caso.edad));

      cy.get(getLocator(caso.campo_peso_locator))
        .should('be.visible').clear().type(String(caso.peso));

      cy.get(getLocator(caso.campo_medicamento_locator))
        .should('be.visible').select(caso.medicamento_id);

      cy.get(getLocator(caso.campo_cliente_locator))
        .should('be.visible').select(caso.cliente_id);

      cy.get(getLocator(caso.campo_submit_locator))
        .should('be.visible').click();

      cy.get(getLocator(caso.campo_listado_locator))
        .should('not.contain', caso.campo_row_search_text);
    });
  });

});