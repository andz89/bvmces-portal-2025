# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Next.js (App Router) school-management portal, deployed to Cloudflare via
OpenNext (`wrangler.jsonc`, `open-next.config.ts`). Most data lives in
Supabase (`utils/supabase/server.js`). Auth/role checks go through
`utils/lib/checkRole.js`.

## Pattern: Google Apps Script as a feature's backend

Some features don't use Supabase at all — instead they're backed by a
Google Sheet through a deployed Apps Script Web App. This is the pattern
used for `mps-term` and `gpa-term` (the "Term" versions of the older
Supabase-backed `mps` / `gpa` quarter features). Reach for this pattern
again whenever a new feature needs the same shape: records organized into
period-based tabs (e.g. one per term + school year), optionally with file
uploads stored in Google Drive, without adding new Supabase tables.

### When to use it

- The user asks for a "Term" variant of an existing quarter-based feature,
  or otherwise describes a feature that should live in a Google Sheet
  instead of a new database table.
- The feature needs to store uploaded files (scanned reports, etc.)
  alongside structured data — Drive + Sheets handles both without needing
  Supabase Storage.

### File layout

For a feature named `<feature>` (e.g. `mps-term`, `gpa-term`):

```
app/features/<feature>/
  AppsScript-Code.gs   # the Apps Script backend (copy/pasted into the
                        # Google Sheet's Apps Script editor — not run by
                        # Next.js, kept here only as the source of truth)
  actions.js            # "use server" actions Next.js calls; these POST
                        # to the deployed Apps Script Web App instead of
                        # querying Supabase
  reportSchema.js        # optional: zod schema + constants (e.g. dropdown
                        # option lists) shared by the actions and the form
```

The route files under `app/(protected)/<feature>/...` import from
`app/features/<feature>/actions` the same way they'd import a local
`actions.js`.

### Apps Script conventions (`AppsScript-Code.gs`)

- A top-of-file comment block documents: what spreadsheet it's bound to,
  the tab naming scheme, the `doPost` actions and what data each expects,
  and the sheet's column layout (row 1 header).
- `SHEET_HEADERS`: an array of column names, single source of truth for
  column order. `rowToObject(r)` and `readAllRows(sheet)` convert raw
  sheet rows to/from plain objects using this array.
- **Tabs are period-scoped and auto-created on demand.** Tab naming is
  `<feature>-{period}-{school_year}` (e.g. `mps-term-1-2026-2027`,
  `gpa-term-1-2026-2027`). `getOrCreateSheet(period, school_year)` looks up
  the tab by name and creates it (with headers) if it doesn't exist yet —
  never provision tabs ahead of time in code. Because `school_year` itself
  contains a dash (`"2026-2027"`), the tab-name regex only assumes the
  period segment has no dashes: `/^<feature>-(\d+)-(.+)$/`.
  A `getRecords`/`getFiles`-style read action scans every sheet whose name
  matches that pattern for the given `school_year` and concatenates rows
  across periods — it does not need to know which tabs already exist.
- `doPost(e)` parses `{ action, data }` from the request body and routes
  to one function per action, wrapping the whole thing in try/catch so
  errors come back as `{ status: "error", message }` instead of a raw
  500. `respond(obj)` wraps any return value as a JSON `ContentService`
  response.
- **Every write path (add/update/delete) takes a `LockService.getScriptLock()`
  around its read-modify-write** to avoid concurrent-edit races, mirroring
  the Sheet-row-locking convention already used elsewhere in this project
  for Supabase-backed writes.
- If the feature needs file uploads: `getOrCreateFolder()` creates (once)
  a Drive folder next to the spreadsheet and remembers its id via
  `PropertiesService.getScriptProperties()`, so it survives re-deploys
  without a hardcoded folder id. `createDriveFile(fileData)` decodes a
  base64 payload, creates the file, sets `DriveApp.Access.ANYONE_WITH_LINK`
  view sharing, and returns `{ fileId, fileUrl, mimeType }` to store in the
  row.
- A `setupSheet()` function (not called from `doPost`) is included purely
  for first-time manual setup: run it once from the Apps Script editor to
  pre-create the first tab (and the Drive folder, if applicable) and
  delete the default `Sheet1`. It's idempotent — safe to re-run.

### Next.js side (`actions.js`)

- `appScriptUrl()` reads a dedicated env var named
  `APPSCRIPT_URL_<FEATURE_NAME_UPPER_SNAKE>` (e.g. `APPSCRIPT_URL_MPS_TERM`,
  `APPSCRIPT_URL_GPA_TERM`) and throws a clear error if it's unset.
- `callAppsScript(action, data)` POSTs `{ action, data }` as JSON, reads
  the response as text first (so a non-JSON error page from Apps Script
  doesn't crash `JSON.parse` silently), and throws using `result.message`
  when `result.status === "error"`.
- Reference data that's still authoritative in Supabase (classes,
  advisers, school years) is fetched separately from Supabase and joined
  onto the Apps Script rows in memory (see `getMPSTermReports` /
  `getGPATerm` for the join pattern) — only the feature's own records live
  in the Sheet.

### Deployment (tell the user to do this after the code is written)

1. Create a new Google Sheet for the feature.
2. Open Extensions → Apps Script, paste in `AppsScript-Code.gs`.
3. Run `setupSheet` once from the editor's function dropdown.
4. Deploy → New deployment → Web App (Execute as: Me, Who has access:
   Anyone).
5. Add the deployment URL to `.env.local` as
   `APPSCRIPT_URL_<FEATURE_NAME_UPPER_SNAKE>=...` and restart the dev
   server (env vars aren't picked up by hot reload).

### Reference implementations

Read these before building a new instance of this pattern:
- `app/features/mps-term/` (has file uploads to Drive)
- `app/features/gpa-term/` (data-only, no file uploads)
- `app/features/llc/` (data-only; also shows the permission-scoped-write
  variant — records aren't tied to a class, but to a grade level, and only
  admins or the teachers who advise a class in that grade may write to it;
  see `getEditableGrades`/`canEditGrade` in its `actions.js` for the
  pattern of checking Supabase's `class.adviser_id` to authorize a write
  before ever calling the Apps Script backend)
