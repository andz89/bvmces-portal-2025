/**
 * Standalone Apps Script backend for the MPS Term feature. Bound to an
 * "MPS Term" spreadsheet, with one sheet tab per term + school year,
 * named "mps-term-{term}-{school_year}" (e.g. "mps-term-1-2026-2027").
 * Tabs are created automatically the first time a report is saved for
 * that term/school year. Deploy as a Web App (Execute as: Me, Who has
 * access: Anyone) and put the resulting URL in APPSCRIPT_URL_MPS_TERM.
 *
 * No manual Drive folder ID needed — the script creates its own
 * "MPS Term Files" folder next to the spreadsheet on first run and
 * remembers its id via PropertiesService.
 *
 * FIRST-TIME SETUP: open this script in the Apps Script editor, pick
 * "setupSheet" from the function dropdown at the top, and click Run once.
 * It pre-creates the "mps-term-1-2026-2027" tab and the Drive folder, and
 * removes the default "Sheet1". Safe to re-run any time. Tabs for other
 * terms/school years are created on demand — no further setup needed.
 *
 * Expected request body (JSON): { action, data }
 * action: "getFiles" | "addMPSTerm" | "updateMPSTerm" | "delete"
 * - getFiles needs: school_year (scans every tab for that school year,
 *   across all terms, and returns the combined rows).
 * - addMPSTerm needs: term, school_year, class_id, exam_type, the 9
 *   subject scores, and optionally fileData ({ fileName, mimeType, data
 *   (base64) }).
 * - updateMPSTerm / delete need: id, term, school_year (term + school_year
 *   locate which tab the row lives in).
 *
 * Sheet columns (row 1 header):
 * id | class_id | term | exam_type | school_year | gmrc | epp | filipino |
 * english | math | science | ap | mapeh | reading_literacy | file_id |
 * file_url | mimeType | owner_email | owner_id | timestamp
 */

var TAB_PREFIX = "mps-term-";
var FOLDER_NAME = "MPS Term Files";
var SHEET_HEADERS = [
  "id",
  "class_id",
  "term",
  "exam_type",
  "school_year",
  "gmrc",
  "epp",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading_literacy",
  "file_id",
  "file_url",
  "mimeType",
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

  var folder = getOrCreateFolder();
  Logger.log("Done. Sheet: " + sheet.getName() + " | Folder: " + folder.getUrl());
}

function getOrCreateFolder() {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty("FOLDER_ID");

  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (err) {
      // Stored id no longer valid; fall through and recreate.
    }
  }

  var ssFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  var parents = ssFile.getParents();
  var parentFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  var folder = parentFolder.createFolder(FOLDER_NAME);

  props.setProperty("FOLDER_ID", folder.getId());
  return folder;
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || {};

    switch (action) {
      case "getFiles":
        return respond(getFiles(data));
      case "addMPSTerm":
        return respond(addRecord(data));
      case "updateMPSTerm":
        return respond(updateRecord(data));
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

// Every tab name is "mps-term-<term>-<school_year>". school_year itself
// may contain dashes (e.g. "2026-2027"), so only the term segment is
// assumed to have no dashes.
var TAB_NAME_PATTERN = /^mps-term-(\d+)-(.+)$/;

function createDriveFile(fileData) {
  var folder = getOrCreateFolder();
  var decoded = Utilities.base64Decode(fileData.data);
  var blob = Utilities.newBlob(decoded, fileData.mimeType, fileData.fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    mimeType: fileData.mimeType,
  };
}

function rowToObject(r) {
  return {
    id: r[0],
    class_id: r[1],
    term: r[2],
    exam_type: r[3],
    school_year: r[4],
    gmrc: r[5],
    epp: r[6],
    filipino: r[7],
    english: r[8],
    math: r[9],
    science: r[10],
    ap: r[11],
    mapeh: r[12],
    reading_literacy: r[13],
    file_id: r[14],
    file_url: r[15],
    mimeType: r[16],
    owner_email: r[17],
    owner_id: r[18],
    timestamp: r[19],
  };
}

function readAllRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(rowToObject);
}

// action: getFiles -> scans every "mps-term-*-<school_year>" tab and
// returns the combined rows across all terms for that school year.
function getFiles(data) {
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

// action: addMPSTerm -> creates the Drive file (if provided) and appends
// a row to the tab for the given term + school year.
function addRecord(data) {
  if (!data.term || !data.school_year) {
    throw new Error("term and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);

    var existing = readAllRows(sheet).find(function (r) {
      return (
        String(r.class_id) === String(data.class_id) &&
        String(r.exam_type) === String(data.exam_type)
      );
    });

    if (existing) {
      throw new Error(
        "A " + data.exam_type + " report already exists for this class and term.",
      );
    }

    var fileId = "", fileUrl = "", mimeType = "";

    if (data.fileData) {
      var created = createDriveFile(data.fileData);
      fileId = created.fileId;
      fileUrl = created.fileUrl;
      mimeType = created.mimeType;
    }

    sheet.appendRow([
      data.id,
      data.class_id,
      data.term,
      data.exam_type,
      data.school_year,
      data.gmrc,
      data.epp,
      data.filipino,
      data.english,
      data.math,
      data.science,
      data.ap,
      data.mapeh,
      data.reading_literacy,
      fileId,
      fileUrl,
      mimeType,
      data.owner_email,
      data.owner_id,
      new Date(),
    ]);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

function findRowById(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2; // 1-indexed row number
  }
  return -1;
}

// action: updateMPSTerm -> edits exam_type + the 9 subject scores for an
// existing row; if a new fileData is provided, the old Drive file (if
// any) is trashed and replaced.
function updateRecord(data) {
  if (!data.term || !data.school_year) {
    throw new Error("term and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var rowNum = findRowById(sheet, data.id);
    if (rowNum === -1) throw new Error("Report not found.");

    var rowValues = sheet.getRange(rowNum, 1, 1, SHEET_HEADERS.length).getValues()[0];
    var fileId = rowValues[14];
    var fileUrl = rowValues[15];
    var mimeType = rowValues[16];

    if (data.fileData) {
      if (fileId) {
        try {
          DriveApp.getFileById(fileId).setTrashed(true);
        } catch (err) {
          // File may already be gone from Drive; continue with the update.
        }
      }

      var created = createDriveFile(data.fileData);
      fileId = created.fileId;
      fileUrl = created.fileUrl;
      mimeType = created.mimeType;
    }

    sheet
      .getRange(rowNum, 4, 1, 1)
      .setValues([[data.exam_type]]);

    sheet
      .getRange(rowNum, 6, 1, 9)
      .setValues([[
        data.gmrc,
        data.epp,
        data.filipino,
        data.english,
        data.math,
        data.science,
        data.ap,
        data.mapeh,
        data.reading_literacy,
      ]]);

    sheet
      .getRange(rowNum, 15, 1, 3)
      .setValues([[fileId, fileUrl, mimeType]]);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

// action: delete -> trashes the associated Drive file (if any) and
// removes the row.
function deleteRecord(data) {
  if (!data.term || !data.school_year) {
    throw new Error("term and school_year are required.");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getOrCreateSheet(data.term, data.school_year);
    var rowNum = findRowById(sheet, data.id);
    if (rowNum === -1) throw new Error("Report not found.");

    var fileId = sheet.getRange(rowNum, 15, 1, 1).getValue();

    if (fileId) {
      try {
        DriveApp.getFileById(fileId).setTrashed(true);
      } catch (err) {
        // File may already be gone from Drive; still remove the row below.
      }
    }

    sheet.deleteRow(rowNum);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}
