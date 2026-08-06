"use client";

import { useState, useEffect } from "react";
import ReportForm from "./reportForm";
import DeleteForm from "./DeleteForm.jsx";
import SearchInput from "./SearchInput";
import {
  BiPlus,
  BiSolidTrash,
  BiEdit,
  BiLinkAlt,
  BiCopy,
} from "react-icons/bi";
import { getGoogleConfig } from "./actions";
import { findReport, getReports } from "./actions";
import toast from "react-hot-toast";
import FullPageLoader from "@/app/components/loader/FullPageLoader";
export default function ReportsClient({
  title,
  reports,
  type,
  profile,
  googleConfig,
}) {
  const [editingReport, setEditingReport] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState(reports ?? []);
  const refreshReports = async () => {
    setLoading(true);
    const res = await getReports(googleConfig);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    if (res.status !== "success") {
      toast.error(result.message || "Upload failed.");

      // throw new Error(result.message || "Upload failed.");
    }
    setLoading(false);
    setFiles(Array.isArray(res) ? res : []);
  };
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

  const sortedReports = Array.isArray(files)
    ? [...files].sort((a, b) => {
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
      })
    : [];
  const getAllReports = () => {
    refreshReports();
  };
  const handleInputSearch = async (keyword) => {
    setLoading(true);
    const res = await findReport(keyword, type);
    if (res.error) {
      toast.error(res.error);
    }
    setFiles(res.data);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Modal */}
      {openForm && (
        <ReportForm
          type={type}
          key={editingReport?.id || "create"}
          setEditingReport={setEditingReport}
          editingReport={editingReport}
          setOpenForm={setOpenForm}
          refreshReports={refreshReports}
        />
      )}
      {loading && <FullPageLoader />}
      {/* Hero */}
      <div className="border-b border-slate-200 bg-[#0f172a]">
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-5 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-slate-200 backdrop-blur">
                📁 File Repository
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white uppercase">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
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
                className="
inline-flex
items-center
justify-center
gap-2
rounded-xl
bg-white
px-4
py-2.5
text-sm
font-medium
text-slate-800
transition
hover:bg-slate-100
cursor-pointer
"
              >
                <BiPlus size={20} />
                Add File
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="mb-8 flex items-center md:justify-between md:flex-row flex-col gap-2  ">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Uploaded Files
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Click the file name to open the uploaded document
            </p>
          </div>
          <div className=" ">
            <SearchInput
              onSearch={(keyword) => handleInputSearch(keyword)}
              onClear={() => getAllReports()}
            />
          </div>
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
        <div className="grid grid-cols-1 gap-3">
          {sortedReports?.map((report) => (
            <div
              key={report.id}
              className="
 
relative
overflow-hidden
rounded-2xl
border
border-slate-200
bg-white
p-4
shadow-sm
transition-all
duration-200
hover:border-slate-300
hover:shadow-md
"
            >
              {/* Glow */}
              <div className="  rounded-full bg-blue-100 opacity-0 blur-3xl transition group-hover:opacity-70" />

              <div className="  flex   justify-between md:flex-row flex-col">
                {/* Left */}
                <div className="flex flex-col sm:flex-row gap-1 ">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {type !== "templates" && (
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
                    <div className="flex items-center">
                      {" "}
                      <a
                        href={report.link}
                        target="_blank"
                        className="
inline-flex
max-w-full
items-start
gap-2
text-base
font-semibold
text-slate-800
transition
hover:text-slate-950
break-words
"
                      >
                        <BiLinkAlt className="mt-1 min-w-[20px]" />
                        <span className="break-all">{report.filename}</span>
                      </a>
                      <button
                        title="Copy link"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(report.link);

                            toast.success("Link copied!");
                          } catch (error) {
                            console.error(error);

                            toast.error("Failed to copy link.");
                          }
                        }}
                        className="
    flex
    ml-2
p-1
    items-center
    justify-center
    rounded-lg
    bg-blue-100
    text-slate-700
    transition
    hover:bg-blue-500
    hover:text-white
    cursor-pointer
  "
                      >
                        <BiCopy size={20} />
                      </button>{" "}
                    </div>

                    {/* Description */}
                    <p
                      className="
 mt-1
text-sm
leading-relaxed
text-slate-500
break-words
"
                    >
                      {report.description}
                    </p>

                    {/* Owner */}
                    <div className="mt-1 text-xs sm:text-sm text-slate-400">
                      Added by{" "}
                      <span className="font-medium text-slate-600 break-all">
                        {report.owner_email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}

                {profile.role === "admin" && (
                  <div className="flex   justify-end gap-2 sm:pl-4">
                    <button
                      onClick={() => {
                        setEditingReport(report);
                        setOpenForm(true);
                      }}
                      className="
flex
h-9
w-9
items-center
justify-center
rounded-xl
bg-slate-100
text-slate-700
transition
hover:bg-slate-900
hover:text-white
cursor-pointer
"
                    >
                      <BiEdit size={20} />
                    </button>

                    {deleteId === report.id ? (
                      <DeleteForm
                        file_id={report.file_id}
                        onCancel={() => setDeleteId(null)}
                        refreshReports={refreshReports}
                        googleConfig={googleConfig}
                      />
                    ) : (
                      <button
                        onClick={() => setDeleteId(report.id)}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-100
                          text-slate-700
                          transition
                          hover:bg-red-500
                          hover:text-white
                          cursor-pointer
                        "
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
