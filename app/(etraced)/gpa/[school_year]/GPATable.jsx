"use client";
import React from "react";
import { BiSolidTrash, BiEdit, BiBookOpen } from "react-icons/bi";
import { deleteGPA } from "./actions";
import { useState } from "react";
import toast from "react-hot-toast";
import FullPageLoader from "../../../components/loader/FullPageLoader";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

const GPATable = ({
  section,
  schoolYear,
  grade,
  data,
  profile,

  quarter,
  setOpenEdit,
  setInitialData,
  class_id,
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
      const result = await deleteGPA({
        class_id,
        quarter,
        school_year: schoolYear,
        password,
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
    <div className="mb-10">
      {loading && <FullPageLoader />}
      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
        error={deleteError}
        description={
          targetRow
            ? `Delete GPA record for Grade ${targetRow.grade} - ${targetRow.section}  Quarter ${targetRow.quarter.toUpperCase()}? This action cannot be undone.`
            : ""
        }
      />
      <div
        className="
          bg-white
          rounded-[28px]
          border
          border-gray-200
          shadow-[0_10px_35px_rgba(0,0,0,0.05)]
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
            from-emerald-50
            via-green-50
            to-white
          "
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div
                className="
                  h-14
                  w-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-600
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                <BiBookOpen size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Grade {grade} — {section.toUpperCase()}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Quarter {quarter} GPA Analysis
                </p>
              </div>
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
                "
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Subjects
                </p>

                <p className="text-lg font-bold text-gray-800">{data.length}</p>
              </div>

              {/* Delete */}
              {profile.role === "admin" && (
                <button
                  onClick={() => {
                    setOpenDelete(true);

                    setTargetRow({
                      quarter,
                      grade,
                      section,
                    });
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-red-500
                    to-rose-600
                    px-5
                    py-3
                    text-white
                    font-semibold
                    shadow-lg
                    transition
                    hover:scale-[1.02]
                  "
                >
                  <BiSolidTrash size={20} />

                  <span>Delete GPA</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Head */}
            <thead>
              {/* Main Categories */}
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm">
                <th rowSpan="2" className="px-5 py-4 text-left font-semibold">
                  SUBJECTS
                </th>

                {[
                  "FAILED",
                  "FAIRLY SATISFACTORY",
                  "SATISFACTORY",
                  "VERY SATISFACTORY",
                  "EXCELLENT",
                ].map((label) => (
                  <th
                    key={label}
                    colSpan="3"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    {label}
                  </th>
                ))}

                {profile.role === "admin" ? (
                  <th
                    rowSpan="2"
                    className="px-5 py-4 text-center font-semibold"
                  >
                    Actions
                  </th>
                ) : (
                  <th
                    rowSpan="2"
                    className="px-5 py-4 text-center font-semibold"
                  ></th>
                )}
              </tr>

              {/* M/F/T */}
              <tr className="bg-emerald-500 text-white text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <th className="px-3 py-3 text-center font-medium">M</th>

                    <th className="px-3 py-3 text-center font-medium">F</th>

                    <th className="px-3 py-3 text-center font-medium">T</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-emerald-50/40
                    transition
                    duration-200
                  "
                >
                  {/* Subject */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-800 uppercase">
                        {item.subject}
                      </p>
                    </div>
                  </td>

                  {/* FAILED */}
                  <td className="text-center">{item.not_meet_male}</td>

                  <td className="text-center">{item.not_meet_female}</td>

                  <td className="text-center font-bold text-red-600">
                    {Number(item.not_meet_male) + Number(item.not_meet_female)}
                  </td>

                  {/* FS */}
                  <td className="text-center">{item.fs_male}</td>

                  <td className="text-center">{item.fs_female}</td>

                  <td className="text-center font-bold text-orange-600">
                    {Number(item.fs_male) + Number(item.fs_female)}
                  </td>

                  {/* S */}
                  <td className="text-center">{item.s_male}</td>

                  <td className="text-center">{item.s_female}</td>

                  <td className="text-center font-bold text-blue-600">
                    {Number(item.s_male) + Number(item.s_female)}
                  </td>

                  {/* VS */}
                  <td className="text-center">{item.vs_male}</td>

                  <td className="text-center">{item.vs_female}</td>

                  <td className="text-center font-bold text-emerald-600">
                    {Number(item.vs_male) + Number(item.vs_female)}
                  </td>

                  {/* EXCELLENT */}
                  <td className="text-center">{item.e_male}</td>

                  <td className="text-center">{item.e_female}</td>

                  <td className="text-center font-bold text-violet-600">
                    {Number(item.e_male) + Number(item.e_female)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {profile.role === "admin" && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setInitialData(item);
                            setOpenEdit(true);
                          }}
                          className="
                            h-11
                            w-11
                            rounded-2xl
                            bg-emerald-50
                            text-emerald-600
                            flex
                            items-center
                            justify-center
                            hover:bg-emerald-100
                            transition
                          "
                        >
                          <BiEdit size={22} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* Empty */}
              {data.length === 0 && (
                <tr>
                  <td colSpan="100%" className="py-16 text-center">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-700">
                        No GPA Records
                      </h3>

                      <p className="text-gray-500">
                        There are currently no GPA records available.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GPATable;
