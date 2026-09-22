import { React, useState } from "react";
import { BiSolidTrash, BiEdit, BiLinkExternal, BiExport } from "react-icons/bi";

import { exportToExcel } from "../utils/exportAsExcel.js";
import { deleteMPSTermReport } from "../../../features/mps-term/actions";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal.jsx";

const TermTable = ({
  mps,
  profile,
  school_year,
  title,
  setInitialData,
  setOpenForm,
}) => {
  const [loading, setLoading] = useState(false);
  const [targetRow, setTargetRow] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isAdmin = profile.role === "admin";
  const showActionsColumn = isAdmin || mps.some((item) => item.canEdit);

  const handleDelete = async (password) => {
    if (!targetRow) return;

    setLoading(true);

    setDeleteError("");
    try {
      const result = await deleteMPSTermReport({
        rowData: targetRow,
        password,
        school_year,
      });

      if (result.success) {
        setOpenDelete(false);

        toast.success(result.message);
      } else if (result.message === "invalid_password") {
        setDeleteError("Invalid password. Please try again.");
      } else {
        setDeleteError(result.message || "Failed to delete MPS record.");
      }
    } catch (error) {
      setDeleteError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-sm
        border
        border-lis-panel-border
        
        overflow-hidden
        w-full
      "
    >
      {/* Header */}
      <div
        className="
          px-6
          py-5
          border-b
          border-lis-panel-border
          bg-lis-panel-header
          
          
        "
      >
        {/* Delete Modal */}
        <ConfirmDeleteModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={handleDelete}
          loading={loading}
          error={deleteError}
          description={
            targetRow
              ? `Delete MPS record for Grade ${targetRow.class.grade} - ${targetRow.class.section} (${targetRow.exam_type})? This action cannot be undone.`
              : ""
          }
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-bold text-lis-text">{title}</h2>

            <p className="text-sm text-lis-muted mt-1">
              {mps.length} record
              {mps.length > 1 ? "s" : ""} available
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div
              className="
                bg-white
                border
                border-lis-panel-border
                rounded-sm
                px-4
                py-2
                
                  text-center
              "
            >
              <p className="text-xs uppercase tracking-wide text-lis-muted">
                Total Records
              </p>

              <p className="text-lg font-bold text-lis-text">{mps.length}</p>
            </div>

            <button
              onClick={() => exportToExcel(mps, true)}
              className="
                inline-flex
                items-center
                gap-2
                rounded-sm
                bg-lis-primary
                
                
                px-5
                py-3
                text-white
                font-semibold
                
                transition
                hover:scale-[1.02]
              "
            >
              <BiExport size={20} />

              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-xs">
          {/* Head */}
          <thead className="bg-lis-panel-header">
            <tr className="text-lis-muted text-[11px]">
              <th className="px-2 py-2 text-left font-semibold min-w-[110px] max-w-[130px]">
                Class
              </th>

              {[
                "GMRC",
                "EPP",
                "Filipino",
                "English",
                "Math",
                "Science",
                "AP",
                "MAPEH",
                "Reading",
              ].map((subject) => (
                <th
                  key={subject}
                  className="px-1.5 py-2 text-center font-semibold"
                >
                  {subject}
                </th>
              ))}

              <th className="px-1.5 py-2 text-center font-semibold">Avg</th>

              <th className="px-1.5 py-2 text-center font-semibold">File</th>

              {showActionsColumn && (
                <th className="px-1.5 py-2 text-center font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {mps?.map((item) => {
              const scores = [
                item.gmrc,
                item.epp,
                item.filipino,
                item.english,
                item.math,
                item.science,
                item.ap,
                item.mapeh,
                item.reading_literacy,
              ].filter(
                (score) =>
                  score !== null &&
                  score !== undefined &&
                  score !== "" &&
                  score !== 0,
              );

              const total = scores.reduce(
                (sum, score) => sum + Number(score),
                0,
              );

              const average =
                scores.length > 0 ? (total / scores.length).toFixed(2) : "-";

              return (
                <tr
                  key={item.id}
                  className="
                    border-t
                    border-lis-panel-border
                    hover:bg-lis-panel-header/40
                    transition
                    duration-200
                  "
                >
                  {/* Class */}
                  <td className="px-2 py-2 min-w-[110px] max-w-[130px]">
                    <div>
                      <h3 className="font-semibold text-lis-text text-xs">
                        Grade {item.class.grade}
                      </h3>

                      <p className="text-[11px] text-lis-link font-medium uppercase">
                        {item.class.section}
                      </p>
                      <p className="text-[10px] text-lis-muted font-semibold uppercase truncate">
                        {item.class.adviser?.full_name?.length > 14
                          ? `${item.class.adviser.full_name.slice(0, 14)}...`
                          : item.class.adviser?.full_name || "N/A"}
                      </p>
                    </div>
                  </td>

                  {/* Scores */}
                  {[
                    item.gmrc,
                    item.epp,
                    item.filipino,
                    item.english,
                    item.math,
                    item.science,
                    item.ap,
                    item.mapeh,
                    item.reading_literacy,
                  ].map((score, idx) => (
                    <td key={idx} className="px-1.5 py-2 text-center">
                      <div
                        className="
                          inline-flex
                          items-center
                          justify-center
                          min-w-[30px]
                          h-7
                          rounded-lg
                          bg-lis-panel-header
                          text-lis-text
                          font-semibold
                          text-xs
                        "
                      >
                        {score || "-"}
                      </div>
                    </td>
                  ))}

                  {/* Average */}
                  <td className="px-1.5 py-2 text-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[44px]
                        h-7
                        rounded-lg
                        bg-lis-primary
                        
                        
                        text-white
                        font-bold
                        text-xs
                        
                      "
                    >
                      {average}
                    </div>
                  </td>

                  {/* File */}
                  <td className="px-1.5 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {item.file_url ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-lg
                            border
                            border-lis-panel-border
                            bg-white
                            px-2
                            py-1
                            text-[11px]
                            font-medium
                            text-lis-text
                            
                            hover:bg-lis-panel-header
                          "
                        >
                          View
                          <BiLinkExternal size={11} />
                        </a>
                      ) : (
                        <span className="text-[11px] text-lis-muted">
                          No file
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  {showActionsColumn && (
                    <td className="px-1.5 py-2">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit */}
                        {item.canEdit && (
                          <button
                            onClick={() => {
                              setInitialData(item);
                              setOpenForm(true);
                            }}
                            className="
                              h-7
                              w-7
                              rounded-lg
                              bg-lis-panel-header
                              text-lis-link
                              flex
                              items-center
                              justify-center
                              hover:bg-lis-panel-header
                              transition
                            "
                          >
                            <BiEdit size={14} />
                          </button>
                        )}

                        {/* Delete */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setOpenDelete(true);

                              setTargetRow(item);
                            }}
                            className="
                                    h-7
                                    w-7
                                    rounded-lg
                                    bg-lis-danger-bg
                                    text-lis-danger-text
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-lis-danger-bg
                                    transition
                                  "
                          >
                            <BiSolidTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Empty */}
            {mps.length === 0 && (
              <tr>
                <td colSpan="100%" className="py-16 text-center">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-lis-text">
                      No Records Found
                    </h3>

                    <p className="text-lis-muted">
                      There are currently no MPS records available.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TermTable;
