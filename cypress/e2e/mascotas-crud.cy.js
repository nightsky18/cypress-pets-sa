import { getCaseFromSheet, getLocator } from '../support/xlsx-helper';

const SHEET = 'ESC05_CRUD_MASC';
const SHEET_UNI = 'ESC03_UNICIDAD';

function cleanNum(val) {
  return String(val).replace('.0', '');
}

function goToMascotasNuevo() {
  cy.visit('/mascotas/');
  cy.contains('Nuevo').should('be.visible').click();
}

function fillMascotaForm(caso) {
  cy.get(getLocator(caso.campo_id_locator))
    .should('be.visible')
    .clear()
    .type(caso.pet_id);

  cy.get(getLocator(caso.campo_nombre_locator))
    .should('be.visible')
    .clear()
    .type(caso.nombre || caso.nombre_mascota);

  cy.get(getLocator(caso.campo_raza_locator))
    .should('be.visible')
    .clear()
    .type(caso.raza);

  cy.get(getLocator(caso.campo_edad_locator))
    .should('be.visible')
    .clear()
    .type(cleanNum(caso.edad));

  cy.get(getLocator(caso.campo_peso_locator))
    .should('be.visible')
    .clear()
    .type(String(caso.peso));

  if (caso.campo_medicamento_locator && caso.medicamento_id) {
    cy.get(getLocator(caso.campo_medicamento_locator))
      .should('be.visible')
      .select(caso.medicamento_id);
  }

  if (caso.campo_cliente_locator && caso.cliente_id) {
    cy.get(getLocator(caso.campo_cliente_locator))
      .should('be.visible')
      .select(caso.cliente_id);
  }
}

function submitForm(locator) {
  cy.get(getLocator(locator))
    .should('be.visible')
    .click();
}

function getRowByText(tableLocator, text) {
  return cy.get(getLocator(tableLocator))
    .contains(text)
    .parents('tr')
    .first();
}

describe('Mascotas - CRUD completo', () => {

  beforeEach(() => {
    cy.login('admin');
  });

  it('M-V-01 - debe crear una mascota válida', () => {
    getCaseFromSheet(SHEET, 'M-V-01').then((caso) => {
      cy.visit('/mascotas/');

      cy.get('body').then(($body) => {
        if ($body.text().includes(caso.campo_row_search_text)) {
          cy.log(`La mascota ${caso.campo_row_search_text} ya existe, no se crea de nuevo`);
          return;
        }

        cy.contains('Nuevo').should('be.visible').click();
        fillMascotaForm(caso);
        submitForm(caso.campo_submit_locator);

        cy.get(getLocator(caso.campo_listado_locator))
          .should('contain', caso.campo_row_search_text);
      });
    });
  });

  it('M-EDIT-01 - debe editar una mascota existente', () => {
    getCaseFromSheet(SHEET, 'M-V-01').then((casoCrear) => {
      cy.visit('/mascotas/');

      cy.get('body').then(($body) => {
        if (!$body.text().includes(casoCrear.campo_row_search_text)) {
          cy.contains('Nuevo').should('be.visible').click();
          fillMascotaForm(casoCrear);
          submitForm(casoCrear.campo_submit_locator);
          cy.visit('/mascotas/');
        }
      });
    });

    getCaseFromSheet(SHEET, 'M-EDIT-01').then((caso) => {
      cy.visit('/mascotas/');

      getRowByText(caso.campo_listado_locator, caso.campo_row_search_text)
        .find(getLocator(caso.campo_edit_btn_locator))
        .first()
        .click();

      cy.get(getLocator(caso.campo_nombre_locator))
        .should('be.visible')
        .clear()
        .type(caso.nombre);

      cy.get(getLocator(caso.campo_raza_locator))
        .should('be.visible')
        .clear()
        .type(caso.raza);

      cy.get(getLocator(caso.campo_edad_locator))
        .should('be.visible')
        .clear()
        .type(cleanNum(caso.edad));

      cy.get(getLocator(caso.campo_peso_locator))
        .should('be.visible')
        .clear()
        .type(String(caso.peso));

      if (caso.campo_medicamento_locator && caso.medicamento_id) {
        cy.get(getLocator(caso.campo_medicamento_locator))
          .should('be.visible')
          .select(caso.medicamento_id);
      }

      if (caso.campo_cliente_locator && caso.cliente_id) {
        cy.get(getLocator(caso.campo_cliente_locator))
          .should('be.visible')
          .select(caso.cliente_id);
      }

      submitForm(caso.campo_submit_locator);

      cy.get(getLocator(caso.campo_listado_locator))
        .should('contain', caso.nombre)
        .and('contain', caso.raza);
    });
  });

  it('M-DEL-01 - debe eliminar una mascota y desaparecer del listado', () => {
    getCaseFromSheet(SHEET, 'M-DEL-01').then((casoDel) => {
      cy.visit('/mascotas/');

      cy.get('body').then(($body) => {
        if (!$body.text().includes(casoDel.campo_row_search_text)) {
          cy.log(`La mascota ${casoDel.campo_row_search_text} no existe para eliminar`);
          return;
        }

        getRowByText(casoDel.campo_listado_locator, casoDel.campo_row_search_text)
          .find(getLocator(casoDel.campo_del_btn_locator))
          .first()
          .click();

        cy.get(getLocator(casoDel.campo_confirm_del_locator))
          .should('be.visible')
          .click();

        cy.get(getLocator(casoDel.campo_listado_locator))
          .should('not.contain', casoDel.campo_row_search_text);
      });
    });
  });

  it('M-I-01 - no debe permitir crear mascota con ID duplicado', () => {
    getCaseFromSheet(SHEET_UNI, 'M-I-01').then((caso) => {
      goToMascotasNuevo();
      fillMascotaForm({
        ...caso,
        campo_id_locator: caso.campo_f1_locator,
        campo_nombre_locator: caso.campo_f2_locator,
        campo_raza_locator: caso.campo_f3_locator,
        campo_edad_locator: caso.campo_f4_locator,
        campo_peso_locator: caso.campo_f5_locator,
        nombre: caso.nombre_mascota
      });

      submitForm(caso.campo_submit_locator);

      cy.get(getLocator(caso.campo_error_locator))
        .should('be.visible')
        .and('contain', caso.expected_error_text);
    });
  });
it('M-I-02 - no debe aceptar peso negativo', () => {
  getCaseFromSheet(SHEET, 'M-I-02').then((caso) => {
    goToMascotasNuevo();
    fillMascotaForm(caso);
    submitForm(caso.campo_submit_locator);

    cy.url().then((url) => {
      if (url.includes('/mascotas/') && !url.includes('/nueva/')) {
        cy.get(getLocator(caso.campo_listado_locator))
          .should('contain', caso.campo_row_search_text);

        throw new Error(
          `BUG: el sistema permitió registrar la mascota ${caso.campo_row_search_text} con peso negativo (${caso.peso})`
        );
      }

      if (caso.campo_error_locator) {
        cy.get(getLocator(caso.campo_error_locator))
          .should('be.visible');
      }
    });
  });
});

});