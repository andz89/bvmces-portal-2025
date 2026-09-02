"use client";

import React, { useState } from "react";

import {
  BiSolidTrash,
  BiEdit,
  BiBookOpen,
  BiBarChartAlt2,
} from "react-icons/bi";

import { deleteGPA } from "./actions";

import toast from "react-hot-toast";

import FullPageLoader from "@/app/components/loader/FullPageLoader";

import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

const GPATable = ({
  section,
  school_year,
  grade,
  data,
  profile,
  quarter,
  setOpenEdit,
  setInitialData,
  class_id,
}) => {
  const [loading, setLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [targetRow, setTargetRow] = useState(null);

  const [deleteError, setDeleteError] = useState("");

  const handleConfirmDelete = async (password) => {
    if (!targetRow) return;

    setLoading(true);

    setDeleteError("");

    try {
      const result = await deleteGPA(
        quarter,
        class_id,
        school_year,
        section,
        grade,
        password,
      );

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
        onConfirm={handleConfirmDelete}
        loading={loading}
        error={deleteError}
        description={
          targetRow
            ? `Delete all GPA records for Quarter ${targetRow.quarter.toUpperCase()}? This action cannot be undone.`
            : ""
        }
      />

      {/* Card */}
      <div
        className="
          bg-white
          rounded-sm
          border
          border-lis-panel-border
          
          overflow-hidden
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div
                className="
                  h-14
                  w-14
                  rounded-sm
                  bg-lis-primary


                  text-white
                  flex
                  items-center
                  justify-center
                  
                "
              >
                <BiBookOpen size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-lis-text">
                  Grade {grade} — {section.toUpperCase()}
                </h2>

                <p className="text-sm text-lis-muted mt-1">
                  Quarter {quarter} GPA analysis and learner performance summary
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Subject Count */}
              <div
                className="
                  bg-white
                  border
                  border-lis-panel-border
                  rounded-sm
                  px-4
                  py-2
                  
                "
              >
                <p className="text-xs uppercase tracking-wide text-lis-muted">
                  Subjects
                </p>

                <p className="text-xl font-bold text-lis-text">
                  {data.length}
                </p>
              </div>

              {/* Delete */}
              {profile?.role === "admin" && (
                <button
                  onClick={() => {
                    setOpenDelete(true);

                    setTargetRow({
                      quarter,
                    });
                  }}
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
              {/* Categories */}
              <tr className="bg-lis-primary   text-white text-sm">
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
                {profile?.role !== "visitor" ? (
                  <th
                    rowSpan="2"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    Actions
                  </th>
                ) : (
                  <th
                    rowSpan="2"
                    className="px-4 py-4 text-center font-semibold"
                  ></th>
                )}
              </tr>

              {/* M/F/T */}
              <tr className="bg-lis-primary text-white text-sm">
                {Array.from({
                  length: 5,
                }).map((_, idx) => (
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
                    border-lis-panel-border
                    hover:bg-lis-panel-header/40
                    transition
                    duration-200
                  "
                >
                  {/* Subject */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          h-10
                          w-10
                          rounded-sm
                          bg-lis-primary
                          
                          
                          text-white
                          font-bold
                          flex
                          items-center
                          justify-center
                          
                        "
                      >
                        <BiBarChartAlt2 />
                      </div>

                      <div>
                        <p className="font-semibold text-lis-text uppercase">
                          {item.subject}
                        </p>

                        {/* <p className="text-xs text-lis-muted">Subject GPA</p> */}
                      </div>
                    </div>
                  </td>

                  {/* FAILED */}
                  <td className="text-center">{item.not_meet_male}</td>

                  <td className="text-center">{item.not_meet_female}</td>

                  <td className="text-center font-bold text-lis-danger-text">
                    {Number(item.not_meet_male) + Number(item.not_meet_female)}
                  </td>

                  {/* FS */}
                  <td className="text-center">{item.fs_male}</td>

                  <td className="text-center">{item.fs_female}</td>

                  <td className="text-center font-bold text-lis-warning-text">
                    {Number(item.fs_male) + Number(item.fs_female)}
                  </td>

                  {/* SATISFACTORY */}
                  <td className="text-center">{item.s_male}</td>

                  <td className="text-center">{item.s_female}</td>

                  <td className="text-center font-bold text-lis-link">
                    {Number(item.s_male) + Number(item.s_female)}
                  </td>

                  {/* VS */}
                  <td className="text-center">{item.vs_male}</td>

                  <td className="text-center">{item.vs_female}</td>

                  <td className="text-center font-bold text-lis-success-text">
                    {Number(item.vs_male) + Number(item.vs_female)}
                  </td>

                  {/* EXCELLENT */}
                  <td className="text-center">{item.e_male}</td>

                  <td className="text-center">{item.e_female}</td>

                  <td className="text-center font-bold text-lis-link">
                    {Number(item.e_male) + Number(item.e_female)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {profile.role !== "visitor" && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setInitialData(item);

                            setOpenEdit(true);
                          }}
                          className="
                            h-11
                            w-11
                            rounded-sm
                            bg-lis-panel-header
                            text-lis-success-text
                            flex
                            items-center
                            justify-center
                            hover:bg-lis-panel-header
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
                      <h3 className="text-2xl font-bold text-lis-text">
                        No GPA Records
                      </h3>

                      <p className="text-lis-muted">
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
