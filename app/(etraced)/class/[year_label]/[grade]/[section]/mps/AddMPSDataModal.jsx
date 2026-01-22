"use client";

import { useState, useEffect } from "react";
import { createMPSData } from "./actions";
import { createOrUpdateMPSData } from "./actions";

export default function AddMPSDataModal({
  section,
  grade,
  year_label,
  profile,
  classID,
  editingData,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingData) setOpen(true);
  }, [editingData]);
  async function handleSubmit(formData) {
    setLoading(true);
    try {
      await createOrUpdateMPSData(formData, section, year_label, grade);
      setOpen(false);
      onClose?.();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  const inputClass = "w-full border px-3 py-2 rounded";

  return (
    <>
      {profile.role === "admin" && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded"
        >
          Add MPS Record
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-55 h-screen">
          <div className="bg-white p-6 rounded w-[500px] space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">Add Class</h2>

            <form action={handleSubmit} className="space-y-3">
              <input type="hidden" name="classID" value={classID} />
              <input type="hidden" name="year_label" value={year_label} />

              <div
                className={`flex flex-col gap-1 ${
                  profile.role !== "admin"
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <label className="text-sm font-medium text-gray-600">
                  Grade {grade.toUpperCase().replace("-", " ")}
                </label>{" "}
              </div>

              <div
                className={`flex flex-col gap-1 ${
                  profile.role !== "admin"
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <label className="text-sm font-medium text-gray-600">
                  Section: {section || ""}
                </label>
              </div>
              <div
                className={`flex flex-col gap-1 ${
                  profile.role !== "admin"
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <label className="text-xs font-medium text-gray-600">
                  Quarter
                </label>
                <select
                  readOnly={profile.role === "admin" ? false : true}
                  name="quarter"
                  defaultValue={
                    editingData?.quarter
                      ? editingData.quarter
                          .toLowerCase()
                          .replace("quarter", "")
                          .trim()
                          .replace("1st", "1st Quarter")
                          .replace("2nd", "2nd Quarter")
                          .replace("3rd", "3rd Quarter")
                          .replace("4th", "4th Quarter")
                      : ""
                  }
                  required
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select Quarter
                  </option>

                  {["1st", "2nd", "3rd", "4th"].map((q) => (
                    <option key={q} value={`${q} Quarter`}>
                      {q} Quarter
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    GMRC
                  </label>
                  <input
                    defaultValue={editingData?.gmrc || ""}
                    name="gmrc"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    EPP
                  </label>
                  <input
                    defaultValue={editingData?.epp || ""}
                    name="epp"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Filipino
                  </label>
                  <input
                    defaultValue={editingData?.filipino || ""}
                    name="filipino"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    English
                  </label>
                  <input
                    defaultValue={editingData?.english || ""}
                    name="english"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Math
                  </label>
                  <input
                    defaultValue={editingData?.math || ""}
                    name="math"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Science
                  </label>
                  <input
                    defaultValue={editingData?.science || ""}
                    name="science"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    AP
                  </label>
                  <input
                    defaultValue={editingData?.ap || ""}
                    name="ap"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    MAPEH
                  </label>
                  <input
                    defaultValue={editingData?.mapeh || ""}
                    name="mapeh"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs font-medium text-gray-600">
                    Reading Literacy
                  </label>
                  <input
                    defaultValue={editingData?.reading_literacy || ""}
                    name="reading_literacy"
                    type="number"
                    step="any"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs font-medium text-gray-600">
                    Link
                  </label>
                  <input
                    defaultValue={editingData?.link || ""}
                    name="link"
                    type="url"
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
              </div>

              {editingData && (
                <input type="hidden" name="id" value={editingData.id} />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false), onClose?.();
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
