"use client";

import { useActionState, useEffect } from "react";
import { createMPSReport, updateMPSReport } from "./actions";

export default function MPSForm({
  class_id,
  section,
  grade,
  initialData = null,
  school_year,
  setInitialData,
  setEditingReport,
  setSuccessMessage,
  setOpenForm,
}) {
  const action = initialData
    ? updateMPSReport.bind(null, initialData.id)
    : createMPSReport;

  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      if (initialData) {
        setSuccessMessage("File updated successfully!");
        setInitialData(null);
      } else {
        setSuccessMessage("File submitted successfully!");
      }
    }
  }, [state]);

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpenForm(false)}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <form
          action={formAction}
          className="
            relative
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[32px]
            bg-white
            shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-violet-700
              px-8
              py-7
            "
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* Left */}
              <div>
                <h2 className="text-3xl font-black text-white">
                  {initialData?.id ? "Edit MPS Report" : "Create MPS Report"}
                </h2>

                <p className="text-blue-100 mt-2">
                  Grade {grade} — {section}
                </p>
              </div>

              {/* Info */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3">
                  <p className="text-xs uppercase text-blue-100">School Year</p>

                  <p className="text-lg font-bold text-white mt-1">
                    {school_year}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3">
                  <p className="text-xs uppercase text-blue-100">Quarter</p>

                  <p className="text-lg font-bold text-white mt-1">
                    {initialData?.quarter || "New"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-y-auto px-6 md:px-8 py-8 bg-[#f8fafc]">
            {/* Error */}
            {state?.error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <input type="hidden" name="class_id" value={class_id} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Academic Scores */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    Academic Performance
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Quarter */}
                    {!initialData ? (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Quarter
                        </label>

                        <select
                          name="quarter"
                          defaultValue={
                            state?.values?.quarter || initialData?.quarter || ""
                          }
                          className={inputClass}
                        >
                          <option value="">Select quarter</option>

                          <option value="1">Quarter 1</option>

                          <option value="2">Quarter 2</option>

                          <option value="3">Quarter 3</option>

                          <option value="4">Quarter 4</option>
                        </select>
                      </div>
                    ) : (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Quarter
                        </label>

                        <input
                          readOnly
                          type="text"
                          name="quarter"
                          defaultValue={
                            state?.values?.quarter || initialData?.quarter || ""
                          }
                          className={`${inputClass} bg-gray-100`}
                        />
                      </div>
                    )}

                    {[
                      "gmrc",
                      "epp",
                      "filipino",
                      "english",
                      "math",
                      "science",
                      "ap",
                      "mapeh",
                      "reading_literacy",
                    ].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                          {field.replace("_", " ")}
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          name={field}
                          defaultValue={
                            state?.values?.[field] || initialData?.[field] || ""
                          }
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    File Sources
                  </h3>

                  <div className="space-y-5">
                    {/* School Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        School Year
                      </label>

                      <input
                        readOnly
                        type="text"
                        name="school_year"
                        defaultValue={school_year}
                        className={`${inputClass} bg-gray-100`}
                      />
                    </div>

                    {/* LLC */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        LLC Source URL
                      </label>

                      <input
                        type="url"
                        name="llc_source"
                        defaultValue={
                          state?.values?.llc_source ||
                          initialData?.llc_source ||
                          ""
                        }
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>

                    {/* MPS */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        MPS Source URL
                      </label>

                      <input
                        type="url"
                        name="mps_source"
                        defaultValue={
                          state?.values?.mps_source ||
                          initialData?.mps_source ||
                          ""
                        }
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                  <h4 className="text-lg font-bold text-gray-800">Tips</h4>

                  <ul className="mt-4 space-y-3 text-sm text-gray-600">
                    <li>• Use accurate decimal values for subject scores.</li>

                    <li>• Verify all links before saving the report.</li>

                    <li>• Ensure the correct quarter is selected.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-white px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="
                w-full
                sm:w-auto
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-6
                py-3
                font-medium
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              Cancel
            </button>

            <button
              disabled={pending}
              className="
                w-full
                sm:w-auto
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-7
                py-3
                font-semibold
                text-white
                shadow-lg
                hover:scale-[1.01]
                transition
                disabled:opacity-60
              "
            >
              {pending ? "Saving..." : "Save Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
