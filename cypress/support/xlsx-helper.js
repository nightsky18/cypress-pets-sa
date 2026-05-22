export function getCaseFromSheet(sheetName, datasetId) {
  return cy.task('readXlsx', {
    filePath: 'cypress/testdata/Dataset-Escenarios-PETS-SA.xlsx',
    sheetName
  }).then((rows) => {
    const caso = rows.find(r => r.dataset_id === datasetId);
    if (!caso) {
      throw new Error(`No se encontró el caso ${datasetId} en ${sheetName}`);
    }
    return caso;
  });
}