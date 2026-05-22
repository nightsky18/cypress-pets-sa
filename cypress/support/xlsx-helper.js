export function getCaseFromSheet(sheetName, datasetId) {
  return cy.task('readXlsx', {
    filePath: 'cypress/testdata/Dataset-Escenarios-PETS-SA.xlsx',
    sheetName
  }).then((rows) => {
    const caso = rows.find(r => r.dataset_id === datasetId);

    if (!caso) {
      throw new Error(`No se encontró el caso ${datasetId} en la hoja ${sheetName}`);
    }

    return caso;
  });
}

export function getLocator(locator) {
  if (!locator) {
    throw new Error('Locator vacío o no definido');
  }

  if (locator.startsWith('id:')) {
    return `#${locator.replace('id:', '')}`;
  }

  if (locator.startsWith('css:')) {
    return locator.replace('css:', '');
  }

  throw new Error(`Formato de locator no soportado: ${locator}`);
}