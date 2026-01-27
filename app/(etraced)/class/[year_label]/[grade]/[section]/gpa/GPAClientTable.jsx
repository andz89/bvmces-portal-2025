"use client";

import { useState, useMemo } from "react";
import QuarterTable from "./QuarterTable";
import { useMPSColumns } from "./useMPSColumns";
import AddEditGPAModal from "./AddEditGPAModal";
import { deleteGPA } from "./actions";
import BulkAddGPAModal from "./BulkAddGPAModal";
import ConfirmDeleteModal from "../../../../../../components/ConfirmDeleteModal";

export default function GPAClientTable({
  data,
  classID,
  profile,
  year_label,
  section,
  grade,
}) {
  const SUBJECT_ORDER = {
    gmrc: 1,
    epp: 2,
    filipino: 3,
    fil: 3,
    english: 4,
    eng: 4,
    math: 5,
    science: 6,
    sci: 6,
    ap: 7,
    mapeh: 8,
    reading: 9,
    reading_literacy: 9,
  };

  const [openBulk, setOpenBulk] = useState(false);
  const baseColumns = useMPSColumns();
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [targetRow, setTargetRow] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const admin = profile.role === "admin" || profile.role === "editor";
  const handleConfirmDelete = async (password) => {
    if (!targetRow) return;

    setLoading(true);
    setDeleteError("");

    const result = await deleteGPA(
      targetRow.id,
      classID,
      year_label,
      section,
      password
    );

    if (result.message === "true") {
      setOpenDelete(false);
    } else if (result.message === "invalid_password") {
      setDeleteError("Invalid password. Please try again.");
    } else {
      setDeleteError("Failed to delete GPA record.");
    }

    setLoading(false);
  };

  const columns = [
    ...baseColumns,
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className={`space-x-2 ${!admin && "hidden"}`}>
          <button
            disabled={profile.role !== "admin" && profile.role !== "editor"}
            onClick={() => {
              setEditingRow(row.original), setOpen(true);
            }}
            className={`px-2 py-1 text-xs rounded  ${
              profile.role !== "admin" && profile.role !== "editor"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Edit
          </button>

          <button
            disabled={profile.role !== "admin"}
            onClick={() => {
              setTargetRow(row.original);
              setDeleteError("");
              setOpenDelete(true);
            }}
            className={`px-2 py-1 text-xs rounded ${
              profile.role !== "admin"
                ? "hidden"
                : "bg-red-100 text-red-700 hover:bg-red-200"
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
  const hasGPAData = QUARTERS.some(
    (q) => dataByQuarter[q] && dataByQuarter[q].length > 0
  );

  return (
    <div className="">
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        error={deleteError}
        description={
          targetRow
            ? `Delete GPA record for ${targetRow.subject.toUpperCase()} (${targetRow.quarter.toUpperCase()})? This action cannot be undone.`
            : ""
        }
      />

      {profile.role === "admin" && (
        <div className="flex  my-2 gap-2">
          <button
            onClick={() => {
              setEditingRow(null);
              setOpen(true);
            }}
            className="bg-slate-800 text-white px-4 py-2 rounded"
          >
            Add GPA
          </button>

          <button
            onClick={() => setOpenBulk(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Bulk Add GPA
          </button>
        </div>
      )}
      <div className="   p-2 space-y-4">
        <h2 className="font-semibold">{hasGPAData && "GPA"}</h2>
        {QUARTERS.map(
          (q) =>
            dataByQuarter[q]?.length > 0 && (
              <QuarterTable
                key={q}
                title={q.toUpperCase()}
                data={[...dataByQuarter[q]].sort((a, b) => {
                  const orderA = SUBJECT_ORDER[a.subject?.toLowerCase()] ?? 99;
                  const orderB = SUBJECT_ORDER[b.subject?.toLowerCase()] ?? 99;
                  return orderA - orderB;
                })}
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
        {/* BULK MODAL */}
        <BulkAddGPAModal
          open={openBulk}
          onClose={() => setOpenBulk(false)}
          classID={classID}
          year_label={year_label}
          section={section}
        />
      </div>
    </div>
  );
}
