"use client";

import { useState, useMemo } from "react";
import ConfirmDeleteModal from "../../../../../../components/ConfirmDeleteModal";
import AddMPSDataModal from "./AddMPSDataModal";
import { deleteMPSData } from "./actions";
import QuarterTable from "./QuarterTable";
import FullPageLoader from "../../../../../../components/loader/FullPageLoader";
export default function MPSClientTable({
  section,
  grade,
  year_label,
  profile,
  classID,
  mpsData,
}) {
  const [editingRow, setEditingRow] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(null);
  const admin = profile.role === "admin" || profile.role === "editor";

  const [openDelete, setOpenDelete] = useState(false);
  const [targetRow, setTargetRow] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  function handleDeleteClick(row) {
    setTargetRow(row);
    setDeleteError("");
    setOpenDelete(true);
  }

  async function handleConfirmDelete(password) {
    if (!targetRow) return;

    setLoading(true);
    setDeletingId(targetRow.id);
    setDeleteError("");

    const result = await deleteMPSData(targetRow.id, classID, password);

    if (result.message === "true") {
      setOpenDelete(false);
    } else if (result.message === "invalid_password") {
      setDeleteError("Invalid password. Please try again.");
    } else {
      setDeleteError("Failed to delete MPS data.");
    }

    setDeletingId(null);
    setLoading(false);
  }

  const SUBJECT_KEYS = [
    "gmrc",
    "epp ",
    "filipino",
    "english",
    "math",
    "science",
    "ap",
    "mapeh",
    "reading_literacy",
  ];

  const columns = useMemo(
    () => [
      { accessorKey: "gmrc", header: "GMRC" },
      { accessorKey: "epp", header: "EPP/MTB" },
      { accessorKey: "filipino", header: "Fil" },
      { accessorKey: "english", header: "Eng" },
      { accessorKey: "math", header: "Math" },
      { accessorKey: "science", header: "Sci" },
      { accessorKey: "ap", header: "AP" },
      { accessorKey: "mapeh", header: "MAPEH" },
      { accessorKey: "reading_literacy", header: "Reading" },

      {
        header: "Total",
        cell: ({ row }) => {
          const values = SUBJECT_KEYS.map((key) =>
            Number(row.original[key])
          ).filter((v) => !isNaN(v) && v > 0);

          if (values.length === 0) return "-";

          const average = values.reduce((sum, v) => sum + v, 0) / values.length;

          return average.toFixed(2);
        },
      },

      {
        accessorKey: "link",
        header: "Link",
        cell: ({ getValue }) =>
          getValue() ? (
            <a href={getValue()} target="_blank" className="text-blue-600 ">
              View
            </a>
          ) : (
            "-"
          ),
      },

      {
        header: admin ? "Action" : " ",
        cell: ({ row }) => (
          <div className={`space-x-2  ${!admin && "hidden"}`}>
            <button
              disabled={profile.role !== "admin" && profile.role !== "editor"}
              onClick={() => setEditingRow(row.original)}
              className={`px-2 py-1 text-xs rounded  ${
                profile.role !== "admin" && profile.role !== "editor"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Edit
            </button>
            <button
              disabled={profile.role == "admin" ? false : true}
              onClick={() => handleDeleteClick(row.original)}
              // disabled={deletingId === row.original.id}
              className={`px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 ${
                profile.role !== "admin"
                  ? "hidden"
                  : "bg-red-100 text-red-700 hover:bg-red-200 "
              }`}
            >
              "Delete"
              {loading && <FullPageLoader />}
            </button>
          </div>
        ),
      },
    ],
    [deletingId, loading]
  );

  const dataByQuarter = useMemo(() => {
    const getGradeNumber = (grade) => Number(grade.replace(/[^0-9]/g, ""));

    const grouped = {
      "1st quarter": [],
      "2nd quarter": [],
      "3rd quarter": [],
      "4th quarter": [],
    };

    mpsData.forEach((item) => {
      if (grouped[item.quarter]) {
        grouped[item.quarter].push(item);
      }
    });

    Object.keys(grouped).forEach((q) => {
      grouped[q].sort(
        (a, b) => getGradeNumber(a.grade_level) - getGradeNumber(b.grade_level)
      );
    });

    return grouped;
  }, [mpsData]);

  return (
    <>
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        error={deleteError}
        description={
          targetRow
            ? `Delete MPS data for Grade ${targetRow.class.grade} – Section ${targetRow.class.section}?`
            : ""
        }
      />

      <AddMPSDataModal
        section={section}
        grade={grade}
        year_label={year_label}
        profile={profile}
        classID={classID}
        editingData={editingRow}
        onClose={() => setEditingRow(null)}
      />
      <div className="    p-2 ">
        <div>MPS</div>
        {Object.entries(dataByQuarter).map(([quarter, data]) => (
          <QuarterTable
            key={quarter}
            title={quarter}
            data={data}
            columns={columns}
          />
        ))}
      </div>
    </>
  );
}
