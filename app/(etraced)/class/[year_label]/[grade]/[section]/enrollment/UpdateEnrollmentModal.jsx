"use client";

import { useEffect, useState } from "react";

import { createOrUpdateEnrollment } from "./actions";

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

export default function UpdateEnrollmentModal({
  section,
  grade,
  year_label,
  class_id,
  editingData,
  onClose,
}) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setOpen(true);
    }
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

  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (!open) return null;

  return (
    <>
      {loading && <FullPageLoader />}

      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Update Enrollment
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update monthly enrollment data
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              await handleSubmit(formData);
            }}
            className="p-6 space-y-5"
          >
            {/* Hidden Fields */}
            <input type="hidden" name="id" value={editingData?.id} />

            <input type="hidden" name="class_id" value={class_id} />

            {/* Grade + Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Grade
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {grade.toUpperCase().replace("-", " ")}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Section
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {section.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Month */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-blue-600">
                Month
              </p>

              <p className="text-xl font-bold text-blue-900 mt-1">
                {editingData?.month}
              </p>
            </div>

            {/* Boys */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Boys</label>

              <input
                type="number"
                name="boys"
                min="0"
                required
                defaultValue={editingData?.boys || 0}
                className={inputClass}
              />
            </div>

            {/* Girls */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Girls</label>

              <input
                type="number"
                name="girls"
                min="0"
                required
                defaultValue={editingData?.girls || 0}
                className={inputClass}
              />
            </div>

            {/* Total Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Current Total
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(editingData?.boys || 0) + (editingData?.girls || 0)}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);

                  onClose?.();
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
