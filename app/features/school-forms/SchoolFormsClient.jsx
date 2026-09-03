"use client";

import React, { useState } from "react";
import SchoolFormForm from "./SchoolFormForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SearchInput from "../reports/SearchInput";
import { SCHOOL_FORM_OPTIONS, SF_NEEDS_GRADE_SECTION, SF2_ROWS } from "./sf2Rows";
import { BiPlus, BiSolidTrash, BiEdit, BiLinkAlt, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { deleteSchoolForm } from "./actions";
import toast from "react-hot-toast";

// Philippine school years run June -> March, so from June onward the
// "active" school year starts in the current calendar year; before that
// it started the previous calendar year.
function getDefaultSchoolYear() {
  const now = new Date();
  const year = now.getFullYear();
  const start = now.getMonth() >= 5 ? year : year - 1;
  return `${start}-${start + 1}`;
}

const SCHOOL_YEAR_OPTIONS = ["2024-2025", "2025-2026", "2026-2027"];

export default function SchoolFormsClient({ profile, records }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [items, setItems] = useState(records ?? []);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolYear, setSchoolYear] = useState(getDefaultSchoolYear());
  const [sfTab, setSfTab] = useState("sf-1");
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Merges a just-created/updated record straight into local state — no
  // refetch of the full list, since Apps Script already hands back exactly
  // the one row that changed.
  const handleSaved = (record) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === record.id);
      if (exists) {
        return prev.map((item) => (item.id === record.id ? record : item));
      }
      return [record, ...prev];
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const result = await deleteSchoolForm(deleteTarget.id, deleteTarget.sf);

      if (result?.error) {
        setDeleteError(result.error);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Submission deleted successfully!");
    } catch (err) {
      console.error(err);
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const sortedItems = (Array.isArray(items) ? items : [])
    .filter((item) => item.sf === sfTab)
    .filter((item) => item.school_year === schoolYear)
    .filter((item) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        item.note?.toLowerCase().includes(t) ||
        item.owner_name?.toLowerCase().includes(t) ||
        item.file_name?.toLowerCase().includes(t)
      );
    })
    .sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted));

  return (
    <div className="min-h-screen bg-lis-panel-header">
      {openForm && (
        <SchoolFormForm
          key={editingRecord?.id || "create"}
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
          setOpenForm={setOpenForm}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="border-b border-lis-panel-border bg-white">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-lis-text">
                School Forms
              </h1>
              <p className="mt-1 text-sm text-lis-muted">
                Submit and manage SF1–SF10 school form records.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingRecord(null);
                setOpenForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-lis-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lis-primary-hover cursor-pointer"
            >
              <BiPlus size={18} />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="mb-4 flex items-center md:justify-between md:flex-row flex-col gap-2">
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="w-40 rounded-lg border border-lis-panel-border bg-white px-3 py-2 text-sm text-lis-text outline-none transition focus:border-lis-primary"
          >
            {SCHOOL_YEAR_OPTIONS.map((sy) => (
              <option key={sy} value={sy}>
                {sy.replace("-", "–")}
              </option>
            ))}
          </select>

          <SearchInput
            onSearch={(keyword) => setSearchTerm(keyword)}
            onClear={() => setSearchTerm("")}
          />
        </div>

        {/* SF Tabs */}
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-lis-panel-border bg-white p-1">
          {SCHOOL_FORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSfTab(opt.value)}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${
                sfTab === opt.value
                  ? "bg-lis-primary text-white"
                  : "text-lis-muted hover:bg-lis-panel-header hover:text-lis-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-lis-panel-border bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-lis-panel-border px-5 py-3">
            <div className="text-sm font-medium text-lis-text">
              {SCHOOL_FORM_OPTIONS.find((o) => o.value === sfTab)?.label} Submissions
            </div>
            <div className="text-xs text-lis-muted">
              {sortedItems.length} file{sortedItems.length === 1 ? "" : "s"}
            </div>
          </div>

          {sortedItems.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="text-sm font-medium text-lis-text">
                No submissions yet
              </h3>
              <p className="mt-1 text-sm text-lis-muted">
                Submitted school forms will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-lis-panel-border bg-lis-panel-header">
                  <tr className="text-left text-lis-muted text-xs uppercase tracking-wide">
                    {sfTab === "sf-2" && (
                      <th className="px-5 py-3 font-medium w-10"></th>
                    )}
                    <th className="px-5 py-3 font-medium">Note</th>
                    {SF_NEEDS_GRADE_SECTION.includes(sfTab) && (
                      <>
                        <th className="px-5 py-3 font-medium">Section</th>
                        <th className="px-5 py-3 font-medium">Grade</th>
                      </>
                    )}
                    <th className="px-5 py-3 font-medium">Submitted By</th>
                    <th className="px-5 py-3 font-medium">File</th>
                    <th className="px-5 py-3 font-medium text-center">--</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-lis-panel-border">
                  {sortedItems.map((item) => {
                    const canManage =
                      (item.owner_email || "").toLowerCase() ===
                        (profile?.email || "").toLowerCase() ||
                      profile?.role === "admin";
                    const isExpanded = expandedIds.has(item.id);
                    const columnCount =
                      (sfTab === "sf-2" ? 1 : 0) +
                      1 + // Note
                      (SF_NEEDS_GRADE_SECTION.includes(sfTab) ? 2 : 0) +
                      3; // Submitted By, File, Actions

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="text-sm hover:bg-lis-panel-header transition">
                          {sfTab === "sf-2" && (
                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleExpanded(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-lis-muted transition hover:bg-lis-panel-header hover:text-lis-text cursor-pointer"
                              >
                                {isExpanded ? (
                                  <BiChevronUp size={18} />
                                ) : (
                                  <BiChevronDown size={18} />
                                )}
                              </button>
                            </td>
                          )}
                          <td className="px-5 py-4 max-w-60 text-lis-muted break-words">
                            {item.note}
                          </td>
                          {SF_NEEDS_GRADE_SECTION.includes(sfTab) && (
                            <>
                              <td className="px-5 py-4 text-lis-muted">
                                {item.section}
                              </td>
                              <td className="px-5 py-4 text-lis-muted">
                                {item.grade}
                              </td>
                            </>
                          )}
                          <td className="px-5 py-4 max-w-48 break-words">
                            <div className="font-medium text-lis-text">
                              {item.owner_name}
                            </div>
                            <div className="text-xs text-lis-muted break-all">
                              {item.owner_email}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {item.file_url && (
                              <a
                                href={item.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-lis-link hover:underline"
                              >
                                <BiLinkAlt size={13} />
                                {item.file_name || "View file"}
                              </a>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {canManage && (
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingRecord(item);
                                    setOpenForm(true);
                                  }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lis-muted transition hover:bg-lis-panel-header hover:text-lis-text cursor-pointer"
                                >
                                  <BiEdit size={16} />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteTarget({ id: item.id, sf: item.sf })
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lis-muted transition hover:bg-lis-danger-bg hover:text-lis-danger-text cursor-pointer"
                                >
                                  <BiSolidTrash size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {sfTab === "sf-2" && isExpanded && (
                          <tr className="bg-lis-panel-header">
                            <td colSpan={columnCount} className="px-5 py-4">
                              <Sf2DetailTable item={item} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        loading={deleting}
        error={deleteError}
        onCancel={() => {
          if (deleting) return;
          setDeleteError("");
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Sf2DetailTable({ item }) {
  return (
    <div className="rounded-lg border border-lis-panel-border bg-white p-4">
      <div className="mb-3 flex flex-wrap gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-lis-muted">Month</p>
          <p className="text-sm font-medium text-lis-text">{item.month || "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-lis-muted">
            No. of Days of Classes
          </p>
          <p className="text-sm font-medium text-lis-text">
            {item.days_of_classes ?? "—"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-lis-muted">
              <th className="py-2 pr-2 font-medium">Item</th>
              <th className="py-2 px-1 font-medium text-center w-20">M</th>
              <th className="py-2 px-1 font-medium text-center w-20">F</th>
              <th className="py-2 pl-1 font-medium text-center w-20">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lis-panel-border">
            {SF2_ROWS.map(({ key, label }) => (
              <tr key={key}>
                <td className="py-2 pr-2 text-lis-text">{label}</td>
                <td className="py-2 px-1 text-center text-lis-muted">
                  {item[`${key}_m`] ?? "—"}
                </td>
                <td className="py-2 px-1 text-center text-lis-muted">
                  {item[`${key}_f`] ?? "—"}
                </td>
                <td className="py-2 pl-1 text-center font-medium text-lis-text">
                  {item[`${key}_total`] ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
