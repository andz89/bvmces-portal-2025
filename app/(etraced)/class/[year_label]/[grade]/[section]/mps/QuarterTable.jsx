import { React, useState } from "react";
import { BiSolidTrash, BiEdit, BiLinkExternal } from "react-icons/bi";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import { deleteMPS } from "./actions";
const QuarterTable = ({
  mps,
  profile,
  deleteId,
  setDeleteId,
  title,
  setInitialData,
  setOpenForm,
  class_id,
  school_year,
  section,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [targetRow, setTargetRow] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const handleConfirmDelete = async (password) => {
    if (!targetRow) return;

    setLoading(true);
    setDeleteError("");

    const result = await deleteMPS(
      targetRow.id,
      class_id,
      password,
      school_year,
      section,
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
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
        overflow-hidden
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
        <ConfirmDeleteModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={handleConfirmDelete}
          loading={loading}
          error={deleteError}
          description={
            targetRow
              ? `Delete GPA record for Grade ${targetRow.class.grade} -  Quarter ${targetRow.quarter.toUpperCase()}? This action cannot be undone.`
              : ""
          }
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quarter {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {mps.length} record{mps.length > 1 ? "s" : ""} available
            </p>
          </div>

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              px-4
              py-2
              shadow-sm
            "
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total Records
            </p>

            <p className="text-lg font-bold text-gray-800">{mps.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Head */}
          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-sm">
              <th className="px-5 py-4 text-left font-semibold">Class</th>

              <th className="px-4 py-4 text-center font-semibold">GMRC</th>

              <th className="px-4 py-4 text-center font-semibold">EPP</th>

              <th className="px-4 py-4 text-center font-semibold">Filipino</th>

              <th className="px-4 py-4 text-center font-semibold">English</th>

              <th className="px-4 py-4 text-center font-semibold">Math</th>

              <th className="px-4 py-4 text-center font-semibold">Science</th>

              <th className="px-4 py-4 text-center font-semibold">AP</th>

              <th className="px-4 py-4 text-center font-semibold">MAPEH</th>

              <th className="px-4 py-4 text-center font-semibold">Reading</th>

              <th className="px-4 py-4 text-center font-semibold">Average</th>

              <th className="px-4 py-4 text-center font-semibold">Sources</th>

              {profile.role !== "visitor" && (
                <th className="px-4 py-4 text-center font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {mps?.map((item, index) => {
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
                  key={index}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-blue-50/40
                    transition
                    duration-200
                  "
                >
                  {/* Class */}
                  <td className="px-5 py-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Grade {item.class.grade}
                      </h3>

                      <p className="text-sm text-blue-600 font-medium uppercase">
                        {item.class.section}
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
                    <td key={idx} className="px-4 py-4 text-center">
                      <div
                        className="
                          inline-flex
                          items-center
                          justify-center
                          min-w-[52px]
                          h-9
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
                        min-w-[70px]
                        h-10
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        font-bold
                        shadow-sm
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
                  {profile.role !== "visitor" && (
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => {
                            setInitialData(item);
                            setOpenForm(true);
                          }}
                          className="
                            h-10
                            w-10
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-100
                            transition
                          "
                        >
                          <BiEdit size={20} />
                        </button>

                        {/* Delete */}
                        {profile.role === "admin" && (
                          <button
                            onClick={() => {
                              setTargetRow(item);
                              setDeleteError("");
                              setOpenDelete(true);
                            }}
                            className="
                              h-10
                              w-10
                              rounded-xl
                              bg-red-50
                              text-red-600
                              flex
                              items-center
                              justify-center
                              hover:bg-red-100
                              transition
                            "
                          >
                            <BiSolidTrash size={20} />
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
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-700">
                      No records found
                    </p>

                    <p className="text-sm text-gray-500">
                      There are no MPS records available yet.
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
