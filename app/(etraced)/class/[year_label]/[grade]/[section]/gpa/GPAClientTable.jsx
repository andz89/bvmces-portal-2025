"use client";

import { useState, useMemo } from "react";
import QuarterTable from "./QuarterTable";
import { useMPSColumns } from "./useMPSColumns";
import AddEditGPAModal from "./AddEditGPAModal";
import { deleteGPA } from "./actions";

export default function GPAClientTable({
  data,
  classID,
  profile,
  year_label,
  section,
  grade,
}) {
  const baseColumns = useMPSColumns();
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const admin = profile.role === "admin" || profile.role === "editor";

  const columns = [
    ...baseColumns,
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className={`space-x-2 ${!admin && "hidden"}`}>
          <button
            // disabled={profile.role !== "admin"}
            onClick={() => {
              setEditingRow(row.original), setOpen(true);
            }}
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
            onClick={async () => {
              if (!confirm("Delete this GPA record?")) return;
              await deleteGPA(row.original.id, classID, year_label, section);
            }}
            className={`px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 ${
              profile.role !== "admin"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ✅ GROUP DATA BY QUARTER
  const dataByQuarter = useMemo(() => {
    return data.reduce((acc, row) => {
      const quarter = row.quarter?.toLowerCase();
      if (!quarter) return acc;
      acc[quarter] = acc[quarter] || [];
      acc[quarter].push(row);
      return acc;
    }, {});
  }, [data]);

  const QUARTERS = ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"];

  return (
    <div className="">
      <div className="flex  my-2">
        <button
          onClick={() => {
            setEditingRow(null);
            setOpen(true);
          }}
          className="bg-slate-800 text-white px-4 py-2 rounded"
        >
          Add GPA
        </button>
      </div>
      <div className="bg-slate-100  p-2 space-y-4">
        <h2 className="font-semibold">GPA</h2>
        {QUARTERS.map(
          (q) =>
            dataByQuarter[q]?.length > 0 && (
              <QuarterTable
                key={q}
                title={q.toUpperCase()}
                data={dataByQuarter[q]}
                columns={columns}
              />
            )
        )}
        {open && (
          <AddEditGPAModal
            open={open}
            onClose={() => setOpen(false)}
            editingData={editingRow}
            classID={classID}
            year_label={year_label}
            section={section}
            grade={grade}
            profile={profile}
          />
        )}{" "}
      </div>
    </div>
  );
}
