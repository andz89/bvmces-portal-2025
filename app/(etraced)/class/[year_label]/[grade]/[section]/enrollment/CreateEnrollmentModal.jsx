"use client";

import { useState } from "react";

import { createEnrollment } from "./actions";

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

export default function CreateEnrollmentModal({
  section,
  grade,
  year_label,
  class_id,
  enrollmentData,
}) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);

    try {
      await createEnrollment(class_id, year_label, section);

      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Button */}
      {enrollmentData && enrollmentData.length > 0 ? null : (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
        >
          Create Enrollment
        </button>
      )}

      {/* Modal */}
      {open && (
        <div>
          {" "}
          <div className="bg-gray-100/80  fixed z-[9999]     w-full h-full overflow-auto top-0    ">
            {loading && <FullPageLoader />}
            <div className="bg-white p-6 rounded-xl shadow space-y-6 w-[700px] mx-auto my-5">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Enrollment
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  This will automatically generate all school months.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Grade */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Grade
                  </p>

                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {grade.toUpperCase().replace("-", " ")}
                  </p>
                </div>

                {/* Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Section
                  </p>

                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {section.toUpperCase()}
                  </p>
                </div>

                {/* Months */}
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-700 mb-3">
                    School Months to Create
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-900">
                    {[
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                      "January",
                      "February",
                      "March",
                      "April",
                    ].map((month) => (
                      <div
                        key={month}
                        className="bg-white border border-blue-100 rounded-lg px-3 py-2"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Enrollment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
