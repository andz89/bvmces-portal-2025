"use client";

import { useState, useMemo } from "react";

import AddEnrollmentModal from "./AddEnrollmentModal";
import { deleteEnrollment } from "./actions";
import QuarterTable from "./QuarterTable";
import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

export default function EnrollmentClientTable({
  section,
  grade,
  year_label,
  profile,
  class_id,
  enrollmentData,
}) {
  const MONTH_ORDER = [
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "march",
    "april",
  ];
  const sortedEnrollmentData = useMemo(() => {
    if (!enrollmentData) return [];

    return [...enrollmentData].sort((a, b) => {
      const aIndex = MONTH_ORDER.indexOf(a.month.toLowerCase());
      const bIndex = MONTH_ORDER.indexOf(b.month.toLowerCase());

      return aIndex - bIndex;
    });
  }, [enrollmentData]);

  const [editingRow, setEditingRow] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const admin = profile.role === "admin" || profile.role === "editor";

  async function handleDelete(row) {
    setLoading(true);
    const confirmed = confirm("Delete this enrollment record?");
    if (!confirmed) return;

    try {
      setDeletingId(row.id);
      await deleteEnrollment(row.id, year_label, section, class_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: "month",
      header: "Month",
      cell: ({ getValue }) => getValue().toUpperCase(),
    },

    {
      accessorKey: "boys",
      header: "Boys",
    },
    {
      accessorKey: "girls",
      header: "Girls",
    },
    {
      header: "Total",
      cell: ({ row }) => {
        const boys = Number(row.original.boys) || 0;
        const girls = Number(row.original.girls) || 0;
        return boys + girls;
      },
    },
    {
      header: admin ? "Action" : "",
      cell: ({ row }) => (
        <div className={`space-x-2 ${!admin && "hidden"}`}>
          <button
            disabled={profile.role !== "admin"}
            onClick={() => setEditingRow(row.original)}
            className={`px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ${
              profile.role !== "admin"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
          >
            Edit
          </button>

          <button
            disabled={profile.role !== "admin"}
            onClick={() => handleDelete(row.original)}
            className={` w-[70px] px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 ${
              profile.role !== "admin"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
          >
            {deletingId === row.original.id ? "Deleting " : "Delete"}
          </button>
        </div>
      ),
    },
  ]);

  return (
    <>
      {loading && <FullPageLoader />}
      <AddEnrollmentModal
        section={section}
        grade={grade}
        year_label={year_label}
        profile={profile}
        class_id={class_id}
        editingData={editingRow}
        onClose={() => setEditingRow(null)}
      />

      <div className="bg-slate-100 p-2">
        <QuarterTable
          title="Enrollment"
          data={sortedEnrollmentData}
          columns={columns}
        />
      </div>
    </>
  );
}
