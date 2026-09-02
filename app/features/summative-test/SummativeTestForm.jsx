"use client";

import { useRef, useState } from "react";
import { createSummativeTest, updateSummativeTest } from "./actions";
import toast from "react-hot-toast";
import { BiCloudUpload, BiSave, BiX, BiUpload } from "react-icons/bi";

const MAX_FILE_SIZE = 52428800;
const ALLOWED_EXTENSIONS = [".doc", ".docx"];

function isWordFile(file) {
  const name = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

const inputClass =
  "w-full rounded-lg border border-lis-panel-border bg-white px-3.5 py-2.5 text-sm text-lis-text outline-none transition focus:border-lis-primary";

export default function SummativeTestForm({
  editingRecord = null,
  setEditingRecord,
  setOpenForm,
  refreshRecords,
}) {
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [loading, setLoading] = useState(false);

  const validateFile = (file, label) => {
    if (!file) return true;

    if (!isWordFile(file)) {
      toast.error(`${label} must be a Word document (.doc, .docx).`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${label} size must not exceed 50 MB.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    const file2 = fileInputRef2.current?.files?.[0];

    if (!editingRecord) {
      if (!file) {
        toast.error("Please upload the Summative Test file.");
        return;
      }
      if (!file2) {
        toast.error("Please upload the TOS file.");
        return;
      }
    }

    if (!validateFile(file, "Summative Test file")) return;
    if (!validateFile(file2, "TOS file")) return;

    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);

      const result = editingRecord
        ? await updateSummativeTest(editingRecord.id, formData)
        : await createSummativeTest(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        editingRecord
          ? "Submission updated successfully!"
          : "Submission uploaded successfully!",
      );

      setOpenForm(false);

      if (editingRecord) {
        setEditingRecord(null);
      }

      await refreshRecords();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
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
                  {editingRecord ? "Edit Submission" : "Submit Summative Test"}
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
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    defaultValue={editingRecord?.title || ""}
                    placeholder="e.g. Grade 4 Mathematics - 3rd Quarter"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-lis-text">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingRecord?.description || ""}
                    placeholder="Enter description..."
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-lis-text">
                      Grade
                    </label>

                    <select
                      key={editingRecord?.grade || ""}
                      name="grade"
                      defaultValue={editingRecord?.grade || ""}
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

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-lis-text">
                      Term
                    </label>

                    <select
                      key={editingRecord?.term || ""}
                      name="term"
                      defaultValue={editingRecord?.term || ""}
                      required
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select Term
                      </option>
                      <option value="1">Term 1</option>
                      <option value="2">Term 2</option>
                      <option value="3">Term 3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-lis-text">
                    Subject
                  </label>

                  <select
                    key={editingRecord?.subject || ""}
                    name="subject"
                    defaultValue={editingRecord?.subject || ""}
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Subject
                    </option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Araling Panlipunan">Araling Panlipunan</option>
                    <option value="MAKABANSA">MAKABANSA</option>
                    <option value="MAPEH">MAPEH</option>
                    <option value="EPP">EPP</option>
                    <option value="GMRC">GMRC</option>
                    <option value="Reading and Literacy">Reading and Literacy</option>
                    <option value="Language">Language</option>
                  </select>
                </div>

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

                {!editingRecord && (
                  <>
                    {/* Summative Test file */}
                    <div>
                      <label className="block text-sm font-medium text-lis-text mb-2">
                        Summative Test File (Word document)
                      </label>

                      <label className="block cursor-pointer">
                        <div className="rounded-lg border border-dashed border-lis-panel-border bg-lis-panel-header hover:border-lis-panel-border transition p-6 text-center">
                          <BiUpload className="mx-auto text-2xl text-lis-muted mb-2" />
                          <p className="text-sm font-medium text-lis-text">Click to upload</p>
                          <p className="text-xs text-lis-muted mt-1">.doc or .docx only</p>
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
                          accept=".doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) {
                              setFileName("");
                              return;
                            }
                            if (!validateFile(f, "Summative Test file")) {
                              e.target.value = "";
                              setFileName("");
                              return;
                            }
                            setFileName(f.name);
                          }}
                        />
                      </label>
                    </div>

                    {/* TOS file */}
                    <div>
                      <label className="block text-sm font-medium text-lis-text mb-2">
                        TOS File (Word document)
                      </label>

                      <label className="block cursor-pointer">
                        <div className="rounded-lg border border-dashed border-lis-panel-border bg-lis-panel-header hover:border-lis-panel-border transition p-6 text-center">
                          <BiUpload className="mx-auto text-2xl text-lis-muted mb-2" />
                          <p className="text-sm font-medium text-lis-text">Click to upload</p>
                          <p className="text-xs text-lis-muted mt-1">.doc or .docx only</p>
                          {fileName2 && (
                            <p className="mt-3 text-xs font-medium text-lis-muted">
                              {fileName2}
                            </p>
                          )}
                        </div>

                        <input
                          ref={fileInputRef2}
                          type="file"
                          name="file2"
                          accept=".doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) {
                              setFileName2("");
                              return;
                            }
                            if (!validateFile(f, "TOS file")) {
                              e.target.value = "";
                              setFileName2("");
                              return;
                            }
                            setFileName2(f.name);
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-lis-panel-border bg-white px-4 py-2.5 text-sm font-medium text-lis-text transition hover:bg-lis-panel-header cursor-pointer"
                >
                  <BiX size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-lis-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lis-panel-header disabled:opacity-50 cursor-pointer"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
