"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createReport, updateReport } from "./actions";

import {
  BiCloudUpload,
  BiLinkAlt,
  BiCalendar,
  BiSave,
  BiX,
} from "react-icons/bi";

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
        {/* Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-900/60 backdrop-blur-sm p-4">
          {/* Modal */}
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-7 text-white">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <BiCloudUpload size={32} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {editingReport ? "Edit File" : "Add File"}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    Fill in the required details below
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Error */}
              {state?.error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {state.error}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Filename */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Filename
                  </label>

                  <input
                    type="text"
                    name="filename"
                    defaultValue={
                      state?.values?.filename || editingReport?.filename || ""
                    }
                    placeholder="File Title"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={
                      state?.values?.description ||
                      editingReport?.description ||
                      ""
                    }
                    placeholder="Enter description..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BiLinkAlt size={18} />
                    Link
                  </label>

                  <input
                    type="url"
                    name="link"
                    defaultValue={
                      state?.values?.link || editingReport?.link || ""
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <input readOnly type="hidden" name="type" defaultValue={type} />

                {/* Stage */}
                {type !== "Templates" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Stage
                    </label>

                    <select
                      key={state?.values?.stage || editingReport?.stage || ""}
                      name="stage"
                      defaultValue={
                        state?.values?.stage || editingReport?.stage || ""
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <BiCalendar size={18} />
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
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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

              {/* Footer */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                >
                  <BiX size={20} />
                  Cancel
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  {pending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}

                  {!pending && <BiSave size={20} />}

                  {pending
                    ? editingReport
                      ? "Updating..."
                      : "Saving..."
                    : editingReport
                      ? "Update File"
                      : "Save File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
