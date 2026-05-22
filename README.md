# Cypress PETS S.A.

> Automatización de pruebas E2E con Cypress  
> Actividad: Exposición aplicada — Pruebas y Gestión de la Configuración  
> Docente: David Fernando Mejía Tabares  
> Fecha de entrega: 23-05-2026

## Equipo

| Integrante | 
|---|
| Mariana Montoya Sepúlveda |
| Mateo Berrío Cardona |
| Yeimy Daniela Herrera |
| Esteban Cano Ramírez |

---

## Contexto

Esta suite automatiza pruebas sobre el sistema **PETS S.A.**, una aplicación web de gestión veterinaria. La actividad pide aplicar **Cypress** como herramienta de automatización complementaria a la suite ya existente en Java.

El sistema probado está desplegado en:  
[https://eyderalexis26.pythonanywhere.com](https://eyderalexis26.pythonanywhere.com)

El repositorio de la suite en Java se puede consultar en:  
[https://github.com/nightsky18/pets-sa-suite-java](https://github.com/nightsky18/pets-sa-suite-java)

---

## Qué es Cypress

Cypress es un framework de automatización E2E (end-to-end) moderno para aplicaciones web. A diferencia de herramientas como Selenium, Cypress corre directamente dentro del navegador, lo que le permite observar y controlar la aplicación en tiempo real sin necesidad de drivers externos.

Sus principales características son:
- ejecución en tiempo real dentro del navegador,
- recarga automática de pruebas al guardar cambios,
- captura automática de screenshots y videos,
- comandos personalizables y reutilizables,
- soporte para pruebas orientadas por datos (data-driven),
- integración directa con Node.js para tareas externas.

---

## Cómo está organizada la suite

```
cypress/
  e2e/
    auth.cy.js                  → login, bloqueo por intentos, sesiones
    acceso-dataset.cy.js        → acceso denegado leído desde Excel
    acceso-roles.cy.js          → acceso denegado por rol (veterinario, recepcionista)
    clientes-unicidad.cy.js     → validación de cédula duplicada
    mascotas-crud.cy.js         → crear, editar, eliminar e invalidar mascotas
    medicamentos-seguridad.cy.js → XSS y SQLi en medicamentos
  support/
    commands.js                 → comando personalizado cy.login()
    e2e.js                      → configuración global
    xlsx-helper.js              → lectura del dataset Excel
  testdata/
    Dataset-Escenarios-PETS-SA.xlsx
cypress.config.js
package.json
```

---

## Escenarios automatizados

| Archivo | Hoja del dataset | Casos cubiertos | RF |
|---|---|---|---|
| `auth.cy.js` | `ESC04_BLOQUEO` | Login válido, bloqueo por 3 intentos, verificación de bloqueo | RF03 |
| `acceso-dataset.cy.js` | `ESC02_ACCESO` | Acceso denegado leído desde Excel | RF04 |
| `acceso-roles.cy.js` | `ESC02_ACCESO` | Veterinario sin acceso a clientes y usuarios; recepcionista sin acceso a medicamentos y usuarios | RF04 |
| `clientes-unicidad.cy.js` | `ESC03_UNICIDAD` | Cédula duplicada en clientes | RF13, RF24 |
| `mascotas-crud.cy.js` | `ESC05_CRUD_MASC` / `ESC03_UNICIDAD` | Crear, editar, eliminar mascota; ID duplicado; peso negativo | RF09, RF11, RF12, RF25 |
| `medicamentos-seguridad.cy.js` | `ESC01_XSS_SQLI` | XSS en nombre, SQLi en descripción de medicamento | RNF04 |

---

## Datos de prueba

Los escenarios no tienen datos quemados en el código. Toda la información de usuarios, locators, valores de entrada y resultados esperados se lee desde el archivo Excel `Dataset-Escenarios-PETS-SA.xlsx`, que está dividido por hojas según el tipo de escenario.

La lectura se hace con `cy.task('readXlsx')`, definida en `cypress.config.js` usando la librería `node-xlsx`. Cada test busca su fila por `dataset_id` y accede a cada columna como propiedad del objeto.

Esto permite cambiar datos de prueba sin tocar el código, mantener una sola fuente de verdad para ambas suites (Java y Cypress) y agregar nuevos casos solo editando el Excel.

---

## Comandos personalizados

El archivo `cypress/support/commands.js` define el comando `cy.login(role)`, que centraliza el flujo de autenticación. En lugar de repetir los pasos de login en cada test, todos los specs lo invocan con una sola línea:

```js
cy.login('admin');    // qa_admin / Admin@2026!
cy.login('vet');      // qa_vet / Vet@2026!
cy.login('recep');    // qa_recep / Recep@2026!
cy.login('bloqueo');  // qa_bloqueo
```

Esto reduce duplicación y hace que los tests sean más legibles y fáciles de mantener.

---

## Defectos encontrados

| ID | Módulo | Descripción | Estado |
|---|---|---|---|
| BUG-006 | Clientes | El sistema acepta payloads XSS en nombre y SQLi en apellidos sin sanitizar | Abierto |
| BUG-007 | Medicamentos | El sistema acepta payload XSS en nombre y SQLi en descripción sin sanitizar | Abierto |
| BUG-008 | Mascotas | El sistema permite registrar una mascota con peso negativo sin mostrar error | Abierto |

---

## Requisitos previos

- Node.js v18 o superior
- npm instalado
- Google Chrome instalado
- Archivo Excel en `cypress/testdata/Dataset-Escenarios-PETS-SA.xlsx`

---

## Instalación

```bash
git clone https://github.com/nightsky18/cypress-pets-sa.git
cd cypress-pets-sa
npm install
```

---

## Ejecución

### Abrir la interfaz gráfica de Cypress

```bash
npx cypress open
```

Muestra todos los spec files en la interfaz de Cypress con reproductor en tiempo real.

### Ejecutar todos los tests en modo headless

```bash
npx cypress run
```

### Ejecutar un spec específico

```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
npx cypress run --spec "cypress/e2e/mascotas-crud.cy.js"
npx cypress run --spec "cypress/e2e/medicamentos-seguridad.cy.js"
```

---

## Videos y capturas

Cypress genera automáticamente:
- **Videos** de cada ejecución en modo headless, guardados en `cypress/videos/`.
- **Screenshots** de fallos, guardados en `cypress/screenshots/`.

Estas salidas quedan disponibles localmente después de cada corrida con `npx cypress run`.

---

## Decisiones de diseño

**Lectura desde Excel con cy.task()**  
`cy.task()` permite ejecutar código Node desde los tests. Se usa para integrar `node-xlsx` y leer el archivo `.xlsx` desde el sistema de archivos, algo que el navegador no puede hacer directamente.

**Aislamiento de pruebas**  
Cypress limpia el estado del navegador entre cada test por defecto. Los casos que necesitan datos previos (como editar o eliminar) verifican la existencia del registro antes de actuar, en lugar de asumir que otro test lo creó.

**Helper getLocator()**  
El dataset define los locators como strings con prefijo (`id:`, `css:`). La función `getLocator()` en `xlsx-helper.js` convierte esos strings al selector correcto antes de pasarlo a `cy.get()`, lo que hace que el dataset controle los selectores sin necesidad de cambiar el código.

---

## Relación con la suite Java

Este repositorio es la implementación Cypress de los mismos escenarios que ya están automatizados en Java con Selenium y JUnit 5. Ambas suites leen el mismo archivo Excel y cubren los mismos requisitos funcionales. Esto permite comparar resultados, detectar diferencias de comportamiento entre herramientas y tener doble cobertura sobre los mismos casos críticos.
