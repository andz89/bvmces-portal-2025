"use client";

import { useRef, useState } from "react";
import { createSchoolForm, updateSchoolForm } from "./actions";
import { SF2_ROWS, SCHOOL_FORM_OPTIONS, SF_NEEDS_GRADE_SECTION } from "./sf2Rows";
import toast from "react-hot-toast";
import { BiCloudUpload, BiSave, BiX, BiUpload } from "react-icons/bi";

const MAX_FILE_SIZE = 52428800;
const ALLOWED_EXTENSIONS = [
  ".xlsx", ".xls", ".doc", ".docx", ".png", ".jpg", ".jpeg",
];

const MONTHS = [
  "June", "July", "August", "September", "October", "November",
  "December", "January", "February", "March", "April", "May",
];

function isAllowedFile(file) {
  const name = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

// Turns an error thrown by the submit call into something a user can act on
// (and report back to us) instead of a bare "Something went wrong."
function describeSubmitError(err) {
  const message = err instanceof Error ? err.message : String(err ?? "");
  const name = err instanceof Error ? err.name : "";

  if (/failed to find server action/i.test(message)) {
    return "This page is out of date. Please refresh the page (Ctrl+F5) and try again.";
  }
  if (name === "NotReadableError" || /ERR_UPLOAD_FILE_CHANGED/i.test(message)) {
    return "The file could not be read. Close it in Excel, save a copy to your Desktop, and attach that copy.";
  }
  if (/failed to fetch|networkerror|network error|load failed|timed? ?out/i.test(message)) {
    return "Connection problem while uploading. Please check your internet and try again.";
  }

  return message
    ? `Upload failed: ${message}`
    : "Upload failed for an unknown reason. Please try again.";
}

const inputClass =
  "w-full rounded-lg border border-lis-panel-border bg-white px-3.5 py-2.5 text-sm text-lis-text outline-none transition focus:border-lis-primary disabled:bg-lis-panel-header disabled:text-lis-muted";

export default function SchoolFormForm({
  editingRecord = null,
  setEditingRecord,
  setOpenForm,
  onSaved,
}) {
  const [sf, setSf] = useState(editingRecord?.sf || "sf-1");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!editingRecord && !file) {
      toast.error("Please upload a file.");
      return;
    }
    if (file) {
      if (!isAllowedFile(file)) {
        toast.error("File must be an Excel, Word, or image file.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must not exceed 50 MB.");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);

      const result = editingRecord
        ? await updateSchoolForm(editingRecord.id, editingRecord.sf, formData)
        : await createSchoolForm(formData);

      if (result?.error) {
        console.error("[school-forms] server returned an error", {
          mode: editingRecord ? "update" : "create",
          sf,
          file: file ? { name: file.name, size: file.size, type: file.type } : null,
          serverError: result.error,
          time: new Date().toISOString(),
        });
        toast.error(result.error);
        return;
      }

      toast.success(
        editingRecord
          ? "Submission updated successfully!"
          : "Submission uploaded successfully!",
      );
      setOpenForm(false);
      if (editingRecord) setEditingRecord(null);
      if (result.record) onSaved(result.record);
    } catch (err) {
      console.error("[school-forms] submit failed", {
        mode: editingRecord ? "update" : "create",
        sf,
        file: file
          ? { name: file.name, size: file.size, type: file.type }
          : null,
        online: typeof navigator !== "undefined" ? navigator.onLine : null,
        connection:
          typeof navigator !== "undefined" && navigator.connection
            ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
              }
            : null,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
        time: new Date().toISOString(),
        errorName: err instanceof Error ? err.name : typeof err,
        errorMessage: err instanceof Error ? err.message : String(err),
        error: err,
      });
      toast.error(describeSubmitError(err), { duration: 8000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
        <div className="flex min-h-full items-center justify-center">
          <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg border border-lis-panel-border bg-white ">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-lis-panel-border px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lis-panel-header text-lis-muted">
                <BiCloudUpload size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-lis-text">
                  {editingRecord ? "Edit Submission" : "Submit School Form"}
                </h2>
                <p className="text-xs text-lis-muted">
                  Fill in the required details below
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-lis-text">
                    School Form
                  </label>

                  <select
                    name="sf"
                    value={sf}
                    onChange={(e) => setSf(e.target.value)}
                    required
                    disabled={!!editingRecord}
                    className={inputClass}
                  >
                    {SCHOOL_FORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`grid gap-4 ${
                    SF_NEEDS_GRADE_SECTION.includes(sf) ? "grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {SF_NEEDS_GRADE_SECTION.includes(sf) && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-lis-text">
                          Section
                        </label>

                        <input
                          type="text"
                          name="section"
                          defaultValue={editingRecord?.section || ""}
                          placeholder="Enter section"
                          required
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-lis-text">
                          Grade
                        </label>

                        <select
                          key={editingRecord?.grade ?? ""}
                          name="grade"
                          defaultValue={String(editingRecord?.grade ?? "")}
                          required
                          className={inputClass}
                        >
                          <option value="" disabled>
                            Select Grade
                          </option>
                          <option value="Kinder">Kinder</option>
                          {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-lis-text">
                      School Year
                    </label>

                    <select
                      key={editingRecord?.school_year || ""}
                      name="school_year"
                      defaultValue={editingRecord?.school_year || ""}
                      required
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select school year
                      </option>
                      <option value="2024-2025">2024–2025</option>
                      <option value="2025-2026">2025–2026</option>
                      <option value="2026-2027">2026–2027</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-lis-text">
                    Note
                  </label>

                  <textarea
                    name="note"
                    rows={3}
                    defaultValue={editingRecord?.note || ""}
                    placeholder="Enter a note about this submission..."
                    className={inputClass}
                    required
                  />
                </div>

                {sf === "sf-2" && <Sf2Fields editingRecord={editingRecord} />}

                {/* File */}
                <div>
                  <label className="block text-sm font-medium text-lis-text mb-2">
                    {editingRecord
                      ? "Replace File (optional)"
                      : "File (Excel, Word, or image)"}
                  </label>

                  {editingRecord?.file_name && (
                    <p className="mb-2 text-xs text-lis-muted">
                      Current file: <span className="font-medium">{editingRecord.file_name}</span>
                    </p>
                  )}

                  <label className="block cursor-pointer">
                    <div className="rounded-lg border border-dashed border-lis-panel-border bg-lis-panel-header hover:border-lis-panel-border transition p-6 text-center">
                      <BiUpload className="mx-auto text-2xl text-lis-muted mb-2" />
                      <p className="text-sm font-medium text-lis-text">Click to upload</p>
                      <p className="text-xs text-lis-muted mt-1">
                        Excel, Word, or image file
                      </p>
                      {fileName && (
                        <p className="mt-3 text-xs font-medium text-lis-muted">
                          {fileName}
                        </p>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      name="file"
                      accept=".xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) {
                          setFileName("");
                          return;
                        }
                        if (!isAllowedFile(f)) {
                          toast.error("File must be an Excel, Word, or image file.");
                          e.target.value = "";
                          setFileName("");
                          return;
                        }
                        if (f.size > MAX_FILE_SIZE) {
                          toast.error("File size must not exceed 50 MB.");
                          e.target.value = "";
                          setFileName("");
                          return;
                        }
                        setFileName(f.name);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOpenForm(false);
                    if (editingRecord) setEditingRecord(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-lis-panel-border bg-white px-4 py-2.5 text-sm font-medium text-lis-text transition hover:bg-lis-panel-header cursor-pointer"
                >
                  <BiX size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-lis-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lis-primary-hover disabled:opacity-50 cursor-pointer"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {!loading && <BiSave size={16} />}
                  {loading
                    ? editingRecord
                      ? "Updating..."
                      : "Saving..."
                    : editingRecord
                      ? "Update Submission"
                      : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function Sf2Fields({ editingRecord }) {
  return (
    <div className="rounded-lg border border-lis-panel-border p-4">
      <p className="mb-3 text-sm font-semibold text-lis-heading">
        SF2 Summary Details
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-lis-text">
            Month
          </label>

          <select
            key={editingRecord?.month || ""}
            name="sf2_month"
            defaultValue={editingRecord?.month || ""}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Select Month
            </option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-lis-text">
            No. of Days of Classes
          </label>

          <input
            type="number"
            name="sf2_days_of_classes"
            min="0"
            defaultValue={editingRecord?.days_of_classes ?? "0"}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-lis-muted">
              <th className="py-2 pr-2 font-medium">Item</th>
              <th className="py-2 px-1 font-medium text-center w-20">M</th>
              <th className="py-2 px-1 font-medium text-center w-20">F</th>
              <th className="py-2 pl-1 font-medium text-center w-20">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lis-panel-border">
            {SF2_ROWS.map(({ key, label }) => (
              <tr key={key}>
                <td className="py-2 pr-2 text-lis-text">{label}</td>
                {["m", "f", "total"].map((col) => (
                  <td key={col} className="py-2 px-1">
                    <input
                      type="number"
                      name={`sf2_${key}_${col}`}
                      min="0"
                      defaultValue={editingRecord?.[`${key}_${col}`] ?? "0"}
                      required
                      className="w-full rounded-md border border-lis-panel-border bg-white px-2 py-1.5 text-center text-sm text-lis-text outline-none focus:border-lis-primary"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
