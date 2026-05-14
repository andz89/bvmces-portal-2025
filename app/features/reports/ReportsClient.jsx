"use client";

import { useState, useEffect } from "react";
import ReportForm from "./reportForm";
import DeleteForm from "./DeleteForm.jsx";

import { BiPlus, BiSolidTrash, BiEdit, BiLinkAlt } from "react-icons/bi";

export default function ReportsClient({ title, reports, type, profile }) {
  const [editingReport, setEditingReport] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (openForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openForm]);

  useEffect(() => {
    if (successMessage) {
      setOpenForm(false);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const sortedReports = [...reports].sort((a, b) => {
    const yearA = parseInt(a.school_year?.split("-")[0]);
    const yearB = parseInt(b.school_year?.split("-")[0]);

    if (yearB !== yearA) {
      return yearB - yearA;
    }

    if (a.stage === "pre" && b.stage !== "pre") {
      return -1;
    }

    if (a.stage !== "pre" && b.stage === "pre") {
      return 1;
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-white shadow-2xl">
            {successMessage}
          </div>
        )}
      </div>

      {/* Modal */}
      {openForm && (
        <ReportForm
          type={type}
          key={editingReport?.id || "create"}
          setEditingReport={setEditingReport}
          editingReport={editingReport}
          setSuccessMessage={setSuccessMessage}
          setOpenForm={setOpenForm}
        />
      )}

      {/* Hero */}
      <div className="  overflow-visible bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-slate-200 backdrop-blur">
                📁 File Repository
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Manage uploaded reports, templates, and academic resources in
                one organized dashboard.
              </p>
            </div>

            {profile.role === "admin" && (
              <button
                onClick={() => {
                  setEditingReport(null);
                  setOpenForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-slate-800 shadow-xl transition hover:scale-[1.02] hover:bg-slate-100 cursor-pointer"
              >
                <BiPlus size={20} />
                Add File
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Uploaded Files</h2>

          <p className="mt-1 text-sm text-slate-500">
            Click the file name to open the uploaded document
          </p>
        </div>

        {/* Empty State */}
        {sortedReports.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
              📂
            </div>

            <h3 className="mt-6 text-xl font-semibold text-slate-700">
              No Files Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Uploaded reports and templates will appear here.
            </p>
          </div>
        )}

        {/* Cards */}
        {/* Cards */}
        <div className="grid grid-cols-1 gap-6">
          {sortedReports?.map((report) => (
            <div
              key={report.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 opacity-0 blur-3xl transition group-hover:opacity-70" />

              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Left */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {/* Icon */}
                  <div className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <BiLinkAlt size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {type !== "Templates" && (
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                          {report.stage}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                          SY: {report.school_year}
                        </span>
                      </div>
                    )}

                    {/* File Name */}
                    <a
                      href={report.link}
                      target="_blank"
                      className="inline-flex max-w-full items-start gap-2 text-lg sm:text-2xl font-bold text-slate-800 transition hover:text-blue-600 break-words"
                    >
                      <BiLinkAlt className="mt-1 min-w-[20px]" />
                      <span className="break-all">{report.filename}</span>
                    </a>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 break-words">
                      {report.description}
                    </p>

                    {/* Owner */}
                    <div className="mt-4 text-xs sm:text-sm text-slate-400">
                      Added by{" "}
                      <span className="font-medium text-slate-600 break-all">
                        {report.owner_email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {profile.role === "admin" && (
                  <div className="flex items-center justify-end gap-2 sm:pl-4">
                    <button
                      onClick={() => {
                        setEditingReport(report);
                        setOpenForm(true);
                      }}
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-500 hover:text-white cursor-pointer"
                    >
                      <BiEdit size={20} />
                    </button>

                    {deleteId === report.id ? (
                      <DeleteForm
                        reportId={report.id}
                        onCancel={() => setDeleteId(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setDeleteId(report.id)}
                        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        <BiSolidTrash size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
