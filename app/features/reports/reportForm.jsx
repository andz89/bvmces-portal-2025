"use client";
import { usePathname } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createReport, updateReport } from "./actions";

export default function ReportForm({
  editingReport = null,
  setEditingReport,
  setSuccessMessage,
  setOpenForm,
  type,
}) {
  const pathname = usePathname();
  const action = editingReport
    ? updateReport.bind(null, editingReport.id)
    : createReport;

  const [state, formAction, pending] = useActionState(action, null);
  useEffect(() => {
    if (state?.success) {
      if (editingReport) {
        setSuccessMessage("Report updated successfully!");
        setEditingReport(null);
      } else {
        setSuccessMessage("Report submitted successfully!");
      }
    }
  }, [state]);
  return (
    <div>
      <form action={formAction}>
        <div className="bg-gray-100/80  fixed    w-full h-full overflow-auto top-0    flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow space-y-6 w-[700px] mx-auto my-5 ">
            {/* Feedback */}
            {state?.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingReport ? "Edit File" : "Add File"}
              </h2>

              <p className="text-sm text-gray-500">
                Fill in the required details below
              </p>
            </div>
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Filename */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Filename
                </label>

                <input
                  type="text"
                  name="filename"
                  defaultValue={
                    state?.values?.filename || editingReport?.filename || ""
                  }
                  placeholder="Phil IRI"
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={
                    state?.values?.description ||
                    editingReport?.description ||
                    ""
                  }
                  placeholder="Enter description..."
                  className="w-full p-2 rounded border border-gray-300"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Link
                </label>

                <input
                  type="url"
                  name="link"
                  defaultValue={
                    state?.values?.link || editingReport?.link || ""
                  }
                  placeholder="https://example.com"
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </div>

              <input
                readOnly
                type="hidden"
                name="type"
                className="w-full p-2 rounded border border-gray-300"
                defaultValue={type}
              />

              {/* Stage */}

              {type !== "Templates" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Stage
                  </label>

                  <select
                    key={state?.values?.stage || editingReport?.stage || ""}
                    name="stage"
                    defaultValue={
                      state?.values?.stage || editingReport?.stage || ""
                    }
                    className="w-full p-2 rounded border border-gray-300"
                  >
                    <option value="">Select stage</option>
                    <option value="pre">Pre</option>
                    <option value="post">Post</option>
                  </select>
                </div>
              )}

              {/* School Year */}
              {type !== "Templates" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    School Year
                  </label>

                  <select
                    key={
                      state?.values?.school_year ||
                      editingReport?.school_year ||
                      ""
                    }
                    name="school_year"
                    defaultValue={
                      state?.values?.school_year ||
                      editingReport?.school_year ||
                      ""
                    }
                    className="w-full p-2 rounded border border-gray-300"
                    required
                  >
                    <option value="">Select school year</option>
                    <option value="2024-2025">2024–2025</option>
                    <option value="2025-2026">2025–2026</option>
                  </select>
                </div>
              )}
              <input type="hidden" name="pathname" defaultValue={pathname} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end w-full index-9999 fixed  top-5 right-5">
          <button
            onClick={() => setOpenForm(false)}
            className=" p-2 rounded bg-rose-400 hover:bg-rose-500 cursor-pointer text-white  flex items-center justify-center gap-2  "
          >
            Cancel
          </button>
          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="p-2 rounded bg-blue-600 text-white  hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {pending && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {pending
              ? editingReport
                ? "Updating..."
                : "Saving..."
              : editingReport
                ? "Update"
                : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
