"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState, useRef } from "react";
import { createReport, updateReport } from "./actions";
import toast from "react-hot-toast";
import {
  BiCloudUpload,
  BiLinkAlt,
  BiCalendar,
  BiSave,
  BiX,
  BiUpload,
  BiUser,
} from "react-icons/bi";

export default function ReportForm({
  editingReport = null,
  setEditingReport,

  setOpenForm,
  type,
  refreshReports,
}) {
  const [fileName, setFileName] = useState("");
  const MAX_FILE_SIZE = 52428800;
  const pathname = usePathname();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file && !editingReport) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("File size must not exceed 50 MB.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);

      const result = editingReport
        ? await updateReport(editingReport.id, formData)
        : await createReport(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        editingReport
          ? "Report updated successfully!"
          : "Report submitted successfully!",
      );

      setOpenForm(false);

      if (editingReport) {
        setEditingReport(null);
      }

      await refreshReports();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Overlay */}
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="flex min-h-full items-center justify-center ">
            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="relative overflow-hidden bg-[#0f172a] px-8 py-7 text-white ">
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
                {/* Grid */}
                <div className=" flex flex-col gap-6  ">
                  {/* Filename */}
                  <div className=" w-full">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Filename
                    </label>

                    <input
                      type="text"
                      name="filename"
                      defaultValue={editingReport?.filename || ""}
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
                      defaultValue={editingReport?.description || ""}
                      placeholder="Enter description..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <input
                    readOnly
                    type="hidden"
                    name="type"
                    defaultValue={type}
                  />

                  {/* Stage */}
                  {type !== "templates" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Stage
                      </label>

                      <select
                        key={editingReport?.stage || ""}
                        name="stage"
                        defaultValue={editingReport?.stage || ""}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="">Select stage</option>
                        <option value="pre">Pre</option>
                        <option value="post">Post</option>
                      </select>
                    </div>
                  )}

                  {/* School Year */}
                  {type !== "templates" && (
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <BiCalendar size={18} />
                        School Year
                      </label>

                      <select
                        key={editingReport?.school_year || ""}
                        name="school_year"
                        defaultValue={editingReport?.school_year || ""}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        required
                      >
                        <option value="">Select school year</option>
                        <option value="2024-2025">2024–2025</option>
                        <option value="2025-2026">2025–2026</option>
                        <option value="2026-2027">2026–2027</option>
                      </select>
                    </div>
                  )}
                  {/* Upload */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Upload Document
                    </label>

                    <label className="block cursor-pointer">
                      <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-emerald-500 transition p-8 text-center">
                        <BiUpload className="mx-auto text-4xl text-emerald-600 mb-3" />

                        <p className="font-medium text-neutral-800">
                          Click to upload
                        </p>

                        <p className="text-sm text-neutral-500 mt-1">
                          Excel, PDF, Word or any document
                        </p>

                        {fileName && (
                          <p className="mt-4 text-sm font-medium text-emerald-700">
                            {fileName}
                          </p>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        name="file"
                        // accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) {
                            setFileName("");
                            return;
                          }

                          if (file.size > MAX_FILE_SIZE) {
                            toast.error("File size must not exceed 50 MB.");

                            e.target.value = "";
                            setFileName("");
                            return;
                          }

                          // setMessage("");
                          // setMessageType("");
                          setFileName(file.name);
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="hidden"
                    name="pathname"
                    defaultValue={pathname}
                  />
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
                    disabled={loading}
                    className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    bg-[#0f172a]
    px-5
    py-3
    font-medium
    text-white
    shadow-lg
    transition
    hover:scale-[1.02]
    hover:shadow-xl
    disabled:opacity-50
    cursor-pointer 
  "
                  >
                    {loading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}

                    {!loading && <BiSave size={20} />}

                    {loading
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
        </div>
      </form>
    </div>
  );
}
