"use client";

import { useState, useEffect } from "react";
import { createOrUpdateEnrollment } from "./actions";

export default function AddEnrollmentModal({
  section,
  grade,
  year_label,
  profile,
  class_id,
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
      await createOrUpdateEnrollment(formData, year_label, section);
      setOpen(false);
      onClose?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border px-3 py-2 rounded";
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      {profile.role === "admin" && (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded"
        >
          Add Enrollment
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[420px] space-y-4">
            <h2 className="text-lg font-semibold">
              {editingData ? "Edit Enrollment" : "Add Enrollment"}
            </h2>

            <form action={handleSubmit} className="space-y-3">
              <input type="hidden" name="class_id" value={class_id} />
              <input type="hidden" name="year_label" value={year_label} />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Grade: {grade.toUpperCase().replace("-", " ")}
                </label>
                <label className="text-sm font-medium text-gray-600">
                  Section: {section.toUpperCase()}
                </label>
              </div>
              {/* Month */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Month
                </label>
                <select
                  disabled={editingData}
                  name="month"
                  required
                  defaultValue={editingData?.month || ""}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select month
                  </option>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boys */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Boys
                </label>
                <input
                  name="boys"
                  type="number"
                  min="0"
                  defaultValue={editingData?.boys || ""}
                  className={inputClass}
                />
              </div>

              {/* Girls */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Girls
                </label>
                <input
                  name="girls"
                  type="number"
                  min="0"
                  defaultValue={editingData?.girls || ""}
                  className={inputClass}
                />
              </div>

              {editingData && (
                <input type="hidden" name="id" value={editingData.id} />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onClose?.();
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
