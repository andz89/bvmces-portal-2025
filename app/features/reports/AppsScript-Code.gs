/**
 * Standalone Apps Script backend for the Reports feature (phil-iri, crla,
 * rma, templates). Bound to your Reports spreadsheet, which has one
 * sheet tab per category, named to match each "type" exactly. Deploy as a
 * Web App (Execute as: Me, Who has access: Anyone) and put the resulting
 * URL in APPSCRIPT_URL_FILE. No Supabase / external config needed — the
 * spreadsheet is resolved via getActiveSpreadsheet() and the Drive folder
 * per category is hardcoded below in FOLDER_IDS.
 *
 * FIRST-TIME SETUP: open this script in the Apps Script editor, pick
 * "setupSheets" from the function dropdown at the top, and click Run once.
 * It creates (or fixes the headers on) the crla / phil-iri / rma / templates
 * tabs on the bound spreadsheet. Safe to re-run any time.
 *
 * Expected request body (JSON): { action, data }
 * action: "getFiles" | "addTemplate" | "updateFile" | "delete"
 * data always includes: type (except updateFile also needs id, delete also
 * needs file_id).
 *
 * Sheet columns (row 1 header):
 * id | filename | description | type | stage | school_year | owner_email |
 * owner_id | file_id | link | mimeType | timestamp
 */

var CATEGORY_SHEETS = ["crla", "phil-iri", "rma", "templates"];
var SHEET_HEADERS = [
  "id",
  "filename",
  "description",
  "type",
  "stage",
  "school_year",
  "owner_email",
  "owner_id",
  "file_id",
  "link",
  "mimeType",
  "timestamp",
];

// Drive folder that uploaded files for each category get saved into.
var FOLDER_IDS = {
  "phil-iri": "1zS0rGsal_Lq0xIZtBQBZ4UpwhH7bgggG",
  crla: "10AXnAfQolMSwRzyCtnLzws5bzmJq6s7r",
  rma: "1s9rtT4V22OcbvsQM-rWSV-UeaSl1csOV",
  templates: "13OGZxjBIavS2N5bHVVVeo9yw0yONUE1f",
};

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  CATEGORY_SHEETS.forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  });

  // Remove the default blank "Sheet1" if it's still around and unused.
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && CATEGORY_SHEETS.indexOf("Sheet1") === -1) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("Done. Sheets: " + ss.getSheets().map(function (s) { return s.getName(); }).join(", "));
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || {};

    switch (action) {
      case "getFiles":
        return respond(getFiles(data));
      case "addTemplate":
        return respond(addFile(data));
      case "updateFile":
        return respond(updateFile(data));
      case "delete":
        return respond(deleteFile(data));
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

function getSheet(data) {
  if (CATEGORY_SHEETS.indexOf(data.type) === -1) {
    throw new Error("Unknown report type: " + data.type);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(data.type);
  if (!sheet) throw new Error("Sheet not found: " + data.type);
  return sheet;
}

function getFolder(type) {
  var folderId = FOLDER_IDS[type];
  if (!folderId) throw new Error("No folder configured for type: " + type);
  return DriveApp.getFolderById(folderId);
}

function rowToObject(r) {
  return {
    id: r[0],
    filename: r[1],
    description: r[2],
    type: r[3],
    stage: r[4],
    school_year: r[5],
    owner_email: r[6],
    owner_id: r[7],
    file_id: r[8],
    link: r[9],
    mimeType: r[10],
    timestamp: r[11],
  };
}

// action: getFiles -> returns a raw array of report rows
function getFiles(data) {
  var sheet = getSheet(data);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  return values.filter(function (r) { return r[0]; }).map(rowToObject);
}

// action: addTemplate -> creates the Drive file (if provided) and appends a row
function addFile(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet(data);

    var fileId = "";
    var fileUrl = "";
    var mimeType = "";

    if (data.fileData) {
      var folder = getFolder(data.type);
      var decoded = Utilities.base64Decode(data.fileData.data);
      var blob = Utilities.newBlob(decoded, data.fileData.mimeType, data.fileData.fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      fileId = file.getId();
      fileUrl = file.getUrl();
      mimeType = data.fileData.mimeType;
    }

    sheet.appendRow([
      data.id,
      data.filename,
      data.description,
      data.type,
      data.stage,
      data.school_year,
      data.owner_email,
      data.owner_id,
      fileId,
      fileUrl,
      mimeType,
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

// action: updateFile -> edits filename/description/type/stage/school_year for an existing row
function updateFile(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet(data);
    var rowNum = findRowById(sheet, data.id);
    if (rowNum === -1) throw new Error("Report not found.");

    sheet
      .getRange(rowNum, 2, 1, 5)
      .setValues([[data.filename, data.description, data.type, data.stage, data.school_year]]);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}

function findRowByFileId(sheet, fileId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var fileIds = sheet.getRange(2, 9, lastRow - 1, 1).getValues();
  for (var i = 0; i < fileIds.length; i++) {
    if (String(fileIds[i][0]) === String(fileId)) return i + 2;
  }
  return -1;
}

// action: delete -> trashes the Drive file and removes its row
function deleteFile(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet(data);
    var rowNum = findRowByFileId(sheet, data.file_id);
    if (rowNum === -1) throw new Error("Report not found.");

    try {
      DriveApp.getFileById(data.file_id).setTrashed(true);
    } catch (err) {
      // File may already be gone from Drive; still remove the row below.
    }

    sheet.deleteRow(rowNum);

    return { status: "success" };
  } finally {
    lock.releaseLock();
  }
}
