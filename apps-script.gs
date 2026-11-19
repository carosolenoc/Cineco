/**
 * Receptor de respuestas para la encuesta de compra de entradas de cine.
 *
 * Cómo usarlo (resumen; los pasos completos están en LEEME.md):
 *  1. Crea un Google Sheet nuevo → Extensiones → Apps Script.
 *  2. Borra el contenido de Code.gs y pega este archivo completo. Guarda.
 *  3. Implementar → Nueva implementación → Tipo: Aplicación web.
 *     - Ejecutar como: Yo
 *     - Quién tiene acceso: Cualquier persona
 *  4. Copia la URL que termina en /exec y pégala en index.html (CONFIG.ENDPOINT).
 *
 * Qué hace:
 *  - Guarda cada respuesta como una fila en la hoja "Respuestas".
 *    La encuesta no pide datos personales: las respuestas son anónimas.
 *  - Ignora envíos de bots (campo trampa) y neutraliza texto que empiece
 *    por = + - @ para que no se interprete como fórmula.
 */

const SHEET_RESPUESTAS = 'Respuestas';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const data = JSON.parse(e.postData.contents);

    // Bots: el campo oculto _hp debe venir vacío
    if (data._hp) return json_({ ok: true, skipped: true });
    delete data._hp;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const respuestas = getSheet_(ss, SHEET_RESPUESTAS);
    appendRow_(respuestas, data);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permite comprobar que la implementación está activa abriendo la URL /exec en el navegador. */
function doGet() {
  return json_({ ok: true, mensaje: 'El receptor de la encuesta está activo.' });
}

function getSheet_(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

/** Agrega una fila respetando (y ampliando si hace falta) los encabezados existentes. */
function appendRow_(sheet, obj) {
  const keys = Object.keys(obj);
  let headers = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
    : [];
  const nuevos = keys.filter(function (k) { return headers.indexOf(k) === -1; });
  if (nuevos.length) {
    headers = headers.concat(nuevos);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  const row = headers.map(function (h) { return safe_(obj[h]); });
  sheet.appendRow(row);
}

function safe_(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'number') return v;
  const s = Array.isArray(v) ? v.join(' | ') : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
