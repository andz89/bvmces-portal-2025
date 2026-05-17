import { React, useState } from "react";
import { BiSolidTrash, BiEdit, BiLinkExternal, BiExport } from "react-icons/bi";

import DeleteForm from "./DeleteForm.jsx";
import { exportToExcel } from "../utils/exportAsExcel.js";
import { deleteMPSReport } from "./actions.jsx";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal.jsx";
const QuarterTable = ({
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
  const handleDelete = async (password) => {
    if (!targetRow) return;

    setLoading(true);

    setDeleteError("");
    try {
      const result = await deleteMPSReport({
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
        setDeleteError(result.message || "Failed to delete GPA record.");
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
        rounded-[28px]
        border
        border-gray-200
        shadow-[0_10px_35px_rgba(0,0,0,0.05)]
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
          border-gray-100
          bg-gradient-to-r
          from-blue-50
          via-indigo-50
          to-white
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
              ? `Delete GPA record for Grade ${targetRow.class.grade} - ${targetRow.class.section}  Quarter ${targetRow.quarter.toUpperCase()}? This action cannot be undone.`
              : ""
          }
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

            <p className="text-sm text-gray-500 mt-1">
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
                border-gray-200
                rounded-2xl
                px-4
                py-2
                shadow-sm
                  text-center
              "
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Records
              </p>

              <p className="text-lg font-bold text-gray-800">{mps.length}</p>
            </div>

            <button
              onClick={() => exportToExcel(mps, true)}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                px-5
                py-3
                text-white
                font-semibold
                shadow-lg
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
        <table className=" w-full ">
          {/* Head */}
          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-sm">
              <th className="px-5 py-4 text-left font-semibold  min-w-[200px] max-w-[200px]">
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
                  className="px-4 py-4 text-center font-semibold"
                >
                  {subject}
                </th>
              ))}

              <th className="px-4 py-4 text-center font-semibold">Average</th>

              <th className="px-4 py-4 text-center font-semibold">Sources</th>

              {profile.role === "admin" && (
                <th className="px-4 py-4 text-center font-semibold">Actions</th>
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
                    border-gray-100
                    hover:bg-blue-50/40
                    transition
                    duration-200
                  "
                >
                  {/* Class */}
                  <td className="px-5 py-4 min-w-[200px] max-w-[200px]w-full">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Grade {item.class.grade}
                      </h3>

                      <p className="text-sm text-blue-600 font-medium uppercase">
                        {item.class.section}
                      </p>
                      <span className="text-xs text-slate-400   uppercase">
                        Adviser:
                      </span>
                      <p className="text-xs text-slate-600 font-bold uppercase">
                        {item.class.adviser?.full_name?.length > 22
                          ? `${item.class.adviser.full_name.slice(0, 22)}...`
                          : item.class.adviser?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-slate-600 font-bold uppercase"></p>
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
                    <td key={idx} className="px-4 py-4 text-center">
                      <div
                        className="
                          inline-flex
                          items-center
                          justify-center
                          min-w-[52px]
                          h-10
                          rounded-xl
                          bg-gray-100
                          text-gray-700
                          font-semibold
                          text-sm
                        "
                      >
                        {score || "-"}
                      </div>
                    </td>
                  ))}

                  {/* Average */}
                  <td className="px-4 py-4 text-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[75px]
                        h-11
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        font-bold
                        shadow-md
                      "
                    >
                      {average}
                    </div>
                  </td>

                  {/* Sources */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {item.llc_source && (
                        <a
                          href={item.llc_source}
                          target="_blank"
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-700
                            shadow-sm
                            hover:bg-gray-50
                          "
                        >
                          LLC
                          <BiLinkExternal size={14} />
                        </a>
                      )}

                      {item.mps_source && (
                        <a
                          href={item.mps_source}
                          target="_blank"
                          className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-700
                            shadow-sm
                            hover:bg-gray-50
                          "
                        >
                          MPS
                          <BiLinkExternal size={14} />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  {profile.role === "admin" && (
                    <td className="px-4 py-4 ">
                      <div className="flex items-center justify-center gap-2">
                        {/* Delete */}

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setInitialData(item);
                            setOpenForm(true);
                          }}
                          className="
                            h-11
                            w-11
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-100
                            transition
                          "
                        >
                          <BiEdit size={21} />
                        </button>
                        <button
                          onClick={() => {
                            setOpenDelete(true);

                            setTargetRow(item);
                          }}
                          className="
                                  h-11
                                  w-11
                                  rounded-2xl
                                  bg-red-50
                                  text-red-600
                                  flex
                                  items-center
                                  justify-center
                                  hover:bg-red-100
                                  transition
                                "
                        >
                          <BiSolidTrash size={21} />
                        </button>
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
                    <h3 className="text-2xl font-bold text-gray-700">
                      No Records Found
                    </h3>

                    <p className="text-gray-500">
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

export default QuarterTable;
