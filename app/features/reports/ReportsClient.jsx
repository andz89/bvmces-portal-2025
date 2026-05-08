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
    // latest school year first
    const yearA = parseInt(a.school_year?.split("-")[0]);
    const yearB = parseInt(b.school_year?.split("-")[0]);

    if (yearB !== yearA) {
      return yearB - yearA;
    }

    // PRE first
    if (a.stage === "pre" && b.stage !== "pre") {
      return -1;
    }

    if (a.stage !== "pre" && b.stage === "pre") {
      return 1;
    }

    return 0;
  });
  return (
    <div>
      <div className="fixed max-w-5xl bottom-10    h-8">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl">
            {successMessage}
          </div>
        )}
      </div>
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

      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>

            <p className="text-slate-500 text-sm mt-1">
              Click the link icon to view the actual file
            </p>
          </div>

          {profile.role === "admin" && (
            <button
              onClick={() => {
                setEditingReport(null);
                setOpenForm(true);
              }}
              className="flex items-center justify-center px-4 py-2 text-white rounded bg-slate-800 cursor-pointer w-30"
            >
              <BiPlus /> Add File
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 ">
          {sortedReports?.map((report) => (
            <div
              key={report.id}
              className="flex flex-col md:flex-row justify-between bg-white hover:bg-slate-100 border border-slate-200 rounded p-4 shadow-sm hover:shadow-sm transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between flex-col   gap-2">
                {type !== "Templates" && (
                  <div className="flex  gap-2 items-center">
                    <div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                        {report.stage}
                      </span>
                    </div>

                    <span>
                      <p className="text-slate-700 text-sm  ">
                        <span className="text-slate-400  uppercase  ">SY:</span>{" "}
                        {report.school_year}
                      </p>
                    </span>
                  </div>
                )}
                <div className="flex flex-col ">
                  <h2 className=" text-xl font-semibold text-slate-800  ">
                    <a
                      href={report.link}
                      target="_blank"
                      className="  text-blue-600  hover:underline break-all flex gap-2 items-center"
                    >
                      <BiLinkAlt /> {report.filename}
                    </a>
                  </h2>

                  <p className="  text-slate-500 text-sm ">
                    {report.description}
                  </p>
                  <span className=" text-sm text-slate-500 text-sm ">
                    Added by: {report.owner_email}
                  </span>
                </div>
              </div>
              <div className="">
                {/* Actions */}
                {profile.role === "admin" && (
                  <div className="flex items-center justify-end  ">
                    <button
                      onClick={() => {
                        setEditingReport(report);
                        setOpenForm(true);
                      }}
                      className="px-1 py-1 rounded    hover:bg-green-200 text-slate-800 text-sm   cursor-pointer"
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
                        className="px-1 py-1 rounded hover:bg-red-200 text-slate-600"
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
