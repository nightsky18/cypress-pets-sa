const { defineConfig } = require("cypress");
const xlsx = require("node-xlsx");
const fs = require("fs");

function normalizeHeader(header) {
  if (!header) return "";

  return String(header)
    .replace(/\$\{|\}/g, "")      // quita ${ }
    .replace(/\*/g, "")           // quita *
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function parseSheet(filePath, sheetName) {
  const workbook = xlsx.parse(fs.readFileSync(filePath));
  const sheet = workbook.find((s) => s.name === sheetName);

  if (!sheet) {
    throw new Error(`No existe la hoja: ${sheetName}`);
  }

  const rows = sheet.data;

  if (!rows || rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);

  return rows
    .slice(1)
    .filter((row) =>
      row.some((cell) => cell !== undefined && cell !== null && String(cell).trim() !== "")
    )
    .map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
}

module.exports = defineConfig({
  pageLoadTimeout: 90000,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: "https://eyderalexis26.pythonanywhere.com/",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    setupNodeEvents(on, config) {
      on("task", {
        readXlsx({ filePath, sheetName }) {
          return parseSheet(filePath, sheetName);
        }
      });

      return config;
    },
  },
});