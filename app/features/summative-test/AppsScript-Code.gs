/**
 * Standalone Apps Script backend for the Summative Test submissions feature.
 * Bound to a "Summative Test" spreadsheet with one sheet tab. Deploy as a
 * Web App (Execute as: Me, Who has access: Anyone) and put the resulting
 * URL in APPSCRIPT_URL_SUMMATIVE_TEST.
 *
 * No manual Drive folder ID needed — the script creates its own "Summative
 * Test Files" folder next to the spreadsheet on first run and remembers its
 * id via PropertiesService.
 *
 * FIRST-TIME SETUP: open this script in the Apps Script editor, pick
 * "setupSheet" from the function dropdown at the top, and click Run once.
 * It creates (or fixes the headers on) the "summative-test" tab and the
 * Drive folder. Safe to re-run any time.
 *
 * Expected request body (JSON): { action, data }
 * action: "getFiles" | "addSummativeTest" | "updateSummativeTest" | "delete"
 * data always includes: id (except getFiles, which needs nothing).
 * addSummativeTest may include fileData (Summative Test file) and/or
 * fileData2 (TOS file), each { fileName, mimeType, data (base64) }.
 *
 * Sheet columns (row 1 header):
 * id | title | description | grade | subject | term | school_year |
 * owner_email | owner_id | file_id | link | mimeType | file_id_2 | link_2 |
 * mimeType_2 | timestamp
 */

var SHEET_NAME = "summative-test";
var FOLDER_NAME = "Summative Test Files";
var SHEET_HEADERS = [
  "id",
  "title",
  "description",
  "grade",
  "subject",
  "term",
  "school_year",
  "owner_email",
  "owner_id",
  "file_id",
  "link",
  "mimeType",
  "file_id_2",
  "link_2",
  "mimeType_2",
  "timestamp",
];

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);

  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && SHEET_NAME !== "Sheet1") {
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
        return respond(getFiles());
      case "addSummativeTest":
        return respond(addRecord(data));
      case "updateSummativeTest":
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

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    var existingNames = ss.getSheets().map(function (s) { return s.getName(); });
    throw new Error(
      "Sheet not found: " + SHEET_NAME +
      " | Bound spreadsheet: \"" + ss.getName() + "\" (" + ss.getId() + ")" +
      " | Existing tabs: [" + existingNames.join(", ") + "]",
    );
  }

  return sheet;
}

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
    title: r[1],
    description: r[2],
    grade: r[3],
    subject: r[4],
    term: r[5],
    school_year: r[6],
    owner_email: r[7],
    owner_id: r[8],
    file_id: r[9],
    link: r[10],
    mimeType: r[11],
    file_id2: r[12],
    link2: r[13],
    mimeType2: r[14],
    timestamp: r[15],
  };
}

// action: getFiles -> returns a raw array of submission rows
function getFiles() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.length).getValues();
  return values.filter(function (r) { return r[0]; }).map(rowToObject);
}

// action: addSummativeTest -> creates up to 2 Drive files (if provided) and appends a row
function addRecord(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet();

    var fileId = "", fileUrl = "", mimeType = "";
    var fileId2 = "", fileUrl2 = "", mimeType2 = "";

    if (data.fileData) {
      var created = createDriveFile(data.fileData);
      fileId = created.fileId;
      fileUrl = created.fileUrl;
      mimeType = created.mimeType;
    }

    if (data.fileData2) {
      var created2 = createDriveFile(data.fileData2);
      fileId2 = created2.fileId;
      fileUrl2 = created2.fileUrl;
      mimeType2 = created2.mimeType;
    }

    sheet.appendRow([
      data.id,
      data.title,
      data.description,
      data.grade,
      data.subject,
      data.term,
      data.school_year,
      data.owner_email,
      data.owner_id,
      fileId,
      fileUrl,
      mimeType,
      fileId2,
      fileUrl2,
      mimeType2,
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

// action: updateSummativeTest -> edits title/description/grade/subject/term/school_year for an existing row
function updateRecord(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet();
    var rowNum = findRowById(sheet, data.id);
    if (rowNum === -1) throw new Error("Submission not found.");

    sheet
      .getRange(rowNum, 2, 1, 6)
      .setValues([[data.title, data.description, data.grade, data.subject, data.term, data.school_year]]);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

// action: delete -> trashes both associated Drive files (if any) and removes the row
function deleteRecord(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet();
    var rowNum = findRowById(sheet, data.id);
    if (rowNum === -1) throw new Error("Submission not found.");

    var rowValues = sheet.getRange(rowNum, 1, 1, SHEET_HEADERS.length).getValues()[0];
    var idsToTrash = [rowValues[9], rowValues[12]].filter(function (id) { return id; });

    idsToTrash.forEach(function (id) {
      try {
        DriveApp.getFileById(id).setTrashed(true);
      } catch (err) {
        // File may already be gone from Drive; still remove the row below.
      }
    });

    sheet.deleteRow(rowNum);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}
