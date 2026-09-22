/**
 * Standalone Apps Script backend for the LLC (Least Learned Competency)
 * feature. Bound to an "LLC" spreadsheet, with one sheet tab per term +
 * school year, named "llc-{term}-{school_year}" (e.g. "llc-1-2026-2027").
 * Tabs are created automatically the first time an LLC entry is saved for
 * that term/school year. Deploy as a Web App (Execute as: Me, Who has
 * access: Anyone) and put the resulting URL in APPSCRIPT_URL_LLC.
 *
 * There is no file/Drive component here — an LLC entry is a single grade
 * + subject + term write-up, one record per (grade, subject) within a
 * term's tab. There is no class/section here: LLC is scoped to the whole
 * grade level, not an individual class.
 *
 * FIRST-TIME SETUP: open this script in the Apps Script editor, pick
 * "setupSheet" from the function dropdown at the top, and click Run once.
 * It pre-creates the "llc-1-2026-2027" tab and removes the default
 * "Sheet1". Safe to re-run any time. Tabs for other terms/school years
 * are created on demand — no further setup needed.
 *
 * Expected request body (JSON): { action, data }
 * action: "getRecords" | "save" | "delete"
 * - getRecords needs: school_year (scans every tab for that school year,
 *   across all terms, and returns the combined rows).
 * - save needs: grade, subject, term, school_year, content, and
 *   optionally owner_email/owner_id. Upserts: if a row already exists for
 *   that grade + subject within the term's tab, its content/owner/
 *   timestamp are updated in place; otherwise a new row is appended.
 * - delete needs: grade, subject, term, school_year (removes that single
 *   grade + subject row from the term's tab).
 *
 * Sheet columns (row 1 header):
 * id | grade | subject | term | school_year | content | owner_email |
 * owner_id | timestamp
 */

var TAB_PREFIX = "llc-";
var SHEET_HEADERS = [
  "id",
  "grade",
  "subject",
  "term",
  "school_year",
  "content",
  "owner_email",
  "owner_id",
  "timestamp",
];

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabName = TAB_PREFIX + "1-2026-2027";
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) sheet = ss.insertSheet(tabName);
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);

  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && tabName !== "Sheet1") {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("Done. Sheet: " + sheet.getName());
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || {};

    switch (action) {
      case "getRecords":
        return respond(getRecords(data));
      case "save":
        return respond(saveRecord(data));
      case "delete":
        return respond(deleteRecord(data));
      default:
        return respond({ status: "error", message: "Unknown action: " + action });
    }
  } catch (err) {
    return respond({ status: "error", message: err.message });
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function tabNameFor(term, school_year) {
  return TAB_PREFIX + term + "-" + school_year;
}

// Locates (or creates) the tab for a given term + school year. Used by
// write actions, which always know exactly which tab they need.
function getOrCreateSheet(term, school_year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = tabNameFor(term, school_year);
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  }

  return sheet;
}

// Every tab name is "llc-<term>-<school_year>". school_year itself may
// contain dashes (e.g. "2026-2027"), so only the term segment is assumed
// to have no dashes.
var TAB_NAME_PATTERN = /^llc-(\d+)-(.+)$/;

function rowToObject(r) {
  return {
    id: r[0],
    grade: r[1],
    subject: r[2],
    term: r[3],
    school_year: r[4],
    content: r[5],
    owner_email: r[6],
    owner_id: r[7],
    timestamp: r[8],
  };
}

function readAllRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(rowToObject);
}

// action: getRecords -> scans every "llc-*-<school_year>" tab and returns
// the combined rows across all terms for that school year.
function getRecords(data) {
  if (!data.school_year) throw new Error("school_year is required.");

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var rows = [];

  sheets.forEach(function (sheet) {
    var match = TAB_NAME_PATTERN.exec(sheet.getName());
    if (!match) return;
    if (match[2] !== data.school_year) return;

    rows = rows.concat(readAllRows(sheet));
  });

  return rows;
}

function findRowByGradeAndSubject(sheet, grade, subject) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var values = sheet.getRange(2, 2, lastRow - 1, 2).getValues(); // grade, subject
  for (var i = 0; i < values.length; i++) {
    if (
      String(values[i][0]) === String(grade) &&
      String(values[i][1]) === String(subject)
    ) {
      return i + 2; // 1-indexed row number
    }
  }
  return -1;
}

// action: save -> upserts the LLC write-up for a grade + subject within
// the given term's tab.
function saveRecord(data) {
  if (!data.term || !data.school_year || !data.grade || !data.subject) {
    throw new Error("grade, subject, term, and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var rowNum = findRowByGradeAndSubject(sheet, data.grade, data.subject);
    var now = new Date();

    if (rowNum === -1) {
      sheet.appendRow([
        Utilities.getUuid(),
        data.grade,
        data.subject,
        data.term,
        data.school_year,
        data.content || "",
        data.owner_email || "",
        data.owner_id || "",
        now,
      ]);
    } else {
      sheet.getRange(rowNum, 6, 1, 4).setValues([[
        data.content || "",
        data.owner_email || "",
        data.owner_id || "",
        now,
      ]]);
    }

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

// action: delete -> removes a single grade + subject row from the given
// term's tab.
function deleteRecord(data) {
  if (!data.term || !data.school_year || !data.grade || !data.subject) {
    throw new Error("grade, subject, term, and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var rowNum = findRowByGradeAndSubject(sheet, data.grade, data.subject);
    if (rowNum === -1) return { status: "success" };

    sheet.deleteRow(rowNum);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}
