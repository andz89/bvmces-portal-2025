/**
 * Standalone Apps Script backend for the GPA Term feature. Bound to a
 * "GPA Term" spreadsheet, with one sheet tab per term + school year,
 * named "gpa-term-{term}-{school_year}" (e.g. "gpa-term-1-2026-2027").
 * Tabs are created automatically the first time a class's GPA records are
 * bulk-created for that term/school year. Deploy as a Web App (Execute
 * as: Me, Who has access: Anyone) and put the resulting URL in
 * APPSCRIPT_URL_GPA_TERM.
 *
 * There is no file/Drive component here — GPA Term is pure proficiency
 * headcount data (same shape as the existing quarter-based GPA feature),
 * just organized by term and stored in Sheets instead of Supabase.
 *
 * FIRST-TIME SETUP: open this script in the Apps Script editor, pick
 * "setupSheet" from the function dropdown at the top, and click Run once.
 * It pre-creates the "gpa-term-1-2026-2027" tab and removes the default
 * "Sheet1". Safe to re-run any time. Tabs for other terms/school years
 * are created on demand — no further setup needed.
 *
 * Expected request body (JSON): { action, data }
 * action: "getRecords" | "addBulk" | "update" | "delete"
 * - getRecords needs: school_year (scans every tab for that school year,
 *   across all terms, and returns the combined rows).
 * - addBulk needs: class_id, term, school_year, and optionally
 *   owner_email/owner_id. Creates one zeroed row per subject (see
 *   SUBJECTS below) for that class + term, unless rows already exist.
 * - update needs: class_id, term, school_year, subject, and the 10
 *   proficiency-count fields.
 * - delete needs: class_id, term, school_year (removes every subject row
 *   for that class + term).
 *
 * Sheet columns (row 1 header):
 * id | class_id | term | subject | school_year | not_meet_male |
 * not_meet_female | fs_male | fs_female | s_male | s_female | vs_male |
 * vs_female | e_male | e_female | owner_email | owner_id | timestamp
 */

var TAB_PREFIX = "gpa-term-";
var SHEET_HEADERS = [
  "id",
  "class_id",
  "term",
  "subject",
  "school_year",
  "not_meet_male",
  "not_meet_female",
  "fs_male",
  "fs_female",
  "s_male",
  "s_female",
  "vs_male",
  "vs_female",
  "e_male",
  "e_female",
  "owner_email",
  "owner_id",
  "timestamp",
];

// Same fixed subject list the quarter-based GPA feature bulk-creates.
var SUBJECTS = [
  "gmrc",
  "epp/MTB",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading",
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
      case "addBulk":
        return respond(addBulk(data));
      case "update":
        return respond(updateRecord(data));
      case "delete":
        return respond(deleteRecords(data));
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

// Every tab name is "gpa-term-<term>-<school_year>". school_year itself
// may contain dashes (e.g. "2026-2027"), so only the term segment is
// assumed to have no dashes.
var TAB_NAME_PATTERN = /^gpa-term-(\d+)-(.+)$/;

function rowToObject(r) {
  return {
    id: r[0],
    class_id: r[1],
    term: r[2],
    subject: r[3],
    school_year: r[4],
    not_meet_male: r[5],
    not_meet_female: r[6],
    fs_male: r[7],
    fs_female: r[8],
    s_male: r[9],
    s_female: r[10],
    vs_male: r[11],
    vs_female: r[12],
    e_male: r[13],
    e_female: r[14],
    owner_email: r[15],
    owner_id: r[16],
    timestamp: r[17],
  };
}

function readAllRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(rowToObject);
}

// action: getRecords -> scans every "gpa-term-*-<school_year>" tab and
// returns the combined rows across all terms for that school year.
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

// action: addBulk -> creates one zeroed row per subject for the given
// class + term, unless that class already has rows in this term's tab.
function addBulk(data) {
  if (!data.term || !data.school_year || !data.class_id) {
    throw new Error("class_id, term, and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);

    var existing = readAllRows(sheet).some(function (r) {
      return String(r.class_id) === String(data.class_id);
    });

    if (existing) {
      throw new Error(
        "GPA records already exist for this class in Term " + data.term + ".",
      );
    }

    var now = new Date();
    var rows = SUBJECTS.map(function (subject) {
      return [
        Utilities.getUuid(),
        data.class_id,
        data.term,
        subject,
        data.school_year,
        0, 0, // not_meet
        0, 0, // fs
        0, 0, // s
        0, 0, // vs
        0, 0, // e
        data.owner_email || "",
        data.owner_id || "",
        now,
      ];
    });

    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, SHEET_HEADERS.length)
      .setValues(rows);

    return { status: "success", inserted: rows.length };
  } finally {
    lock.releaseLock();
  }
}

function findRowByClassAndSubject(sheet, class_id, subject) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var values = sheet.getRange(2, 2, lastRow - 1, 3).getValues(); // class_id, term, subject
  for (var i = 0; i < values.length; i++) {
    if (
      String(values[i][0]) === String(class_id) &&
      String(values[i][2]) === String(subject)
    ) {
      return i + 2; // 1-indexed row number
    }
  }
  return -1;
}

// action: update -> edits the 10 proficiency-count fields for one
// class + term + subject row.
function updateRecord(data) {
  if (!data.term || !data.school_year || !data.class_id || !data.subject) {
    throw new Error("class_id, term, school_year, and subject are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var rowNum = findRowByClassAndSubject(sheet, data.class_id, data.subject);
    if (rowNum === -1) throw new Error("GPA record not found.");

    sheet
      .getRange(rowNum, 6, 1, 10)
      .setValues([[
        data.not_meet_male || 0,
        data.not_meet_female || 0,
        data.fs_male || 0,
        data.fs_female || 0,
        data.s_male || 0,
        data.s_female || 0,
        data.vs_male || 0,
        data.vs_female || 0,
        data.e_male || 0,
        data.e_female || 0,
      ]]);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

// action: delete -> removes every subject row for a class + term.
function deleteRecords(data) {
  if (!data.term || !data.school_year || !data.class_id) {
    throw new Error("class_id, term, and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { status: "success" };

    var values = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // class_id column
    // Delete from bottom to top so row numbers don't shift under us.
    for (var i = values.length - 1; i >= 0; i--) {
      if (String(values[i][0]) === String(data.class_id)) {
        sheet.deleteRow(i + 2);
      }
    }

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}
