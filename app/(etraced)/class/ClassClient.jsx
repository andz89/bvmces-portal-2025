"use client";

import { deleteClass } from "./actions";

import { FaTrash, FaUsers } from "react-icons/fa";

import {
  BiPlus,
  BiBookOpen,
  BiSpreadsheet,
  BiBarChartAlt2,
} from "react-icons/bi";

import FullPageLoader from "../../components/loader/FullPageLoader";

import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

import { useState } from "react";

import { createClass, getClasses } from "./actions";

import Link from "next/link";

export default function ClassClient({
  school_year_id,
  profile,
  year_label,
  initialData,
}) {
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const [targetClass, setTargetClass] = useState(null);

  const [classes, setClasses] = useState(initialData);

  const [grade, setGrade] = useState("");

  const [section, setSection] = useState("");

  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const data = await getClasses(school_year_id, profile);

    setClasses(data);
  };

  const handleCreate = async () => {
    if (!grade || !section) return;

    setLoading(true);

    const result = await createClass({
      school_year_id,
      year_label,
      grade,
      section: section.toLowerCase(),
    });

    if (result.message === "true") {
      setGrade("");
      setSection("");

      await refresh();
    } else if (result.message === "section_exists") {
      alert("Section already exists in this school year.");
    } else {
      alert("Error creating class. Please try again.");
    }

    setLoading(false);
  };

  const handleDeleteClick = (e, classItem) => {
    e.preventDefault();
    e.stopPropagation();

    setTargetClass(classItem);

    setDeleteError("");

    setOpenDelete(true);
  };

  const handleConfirmDelete = async (password) => {
    if (!targetClass) return;

    setLoading(true);

    const result = await deleteClass(targetClass.id, password);

    if (result.message === "true") {
      await refresh();

      setOpenDelete(false);
    } else if (result.message === "invalid_password") {
      setDeleteError("Invalid password. Please try again.");
    } else {
      setDeleteError("Failed to delete class.");
    }

    setLoading(false);
  };

  const gradeRank = {
    kindergarten: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  const groupedClasses = Object.entries(
    [...classes]
      .sort((a, b) => gradeRank[a.grade] - gradeRank[b.grade])
      .reduce((acc, curr) => {
        const gradeLabel =
          curr.grade === "kindergarten" ? "Kinder" : `Grade ${curr.grade}`;

        if (!acc[gradeLabel]) {
          acc[gradeLabel] = [];
        }

        acc[gradeLabel].push(curr);

        return acc;
      }, {}),
  );

  const inputClass = `
    w-full
    rounded-2xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-700
    outline-none
    transition
    focus:border-emerald-500
    focus:ring-4
    focus:ring-emerald-100
  `;

  return (
    <div className="space-y-8">
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        error={deleteError}
        description={
          targetClass
            ? `Delete ${targetClass.grade.toUpperCase()} – Section ${targetClass.section.toUpperCase()}?`
            : ""
        }
      />

      {loading && <FullPageLoader />}

      {/* Create Class */}
      {profile.role === "admin" && (
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
            <div className="flex items-center gap-4">
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
                <BiPlus size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Class
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add and organize class sections efficiently.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Grade
                </label>

                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select Grade
                  </option>

                  <option value="kindergarten">Kindergarten</option>

                  <option value="1">Grade 1</option>

                  <option value="2">Grade 2</option>

                  <option value="3">Grade 3</option>

                  <option value="4">Grade 4</option>

                  <option value="5">Grade 5</option>

                  <option value="6">Grade 6</option>
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Section
                </label>

                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="Enter section"
                  className={inputClass}
                />
              </div>

              {/* Button */}
              <div className="flex items-end">
                <button
                  onClick={handleCreate}
                  disabled={loading || !grade || !section}
                  className="
                    w-full
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-600
                    to-green-600
                    px-5
                    py-3
                    text-white
                    font-semibold
                    shadow-lg
                    hover:scale-[1.01]
                    transition
                    disabled:opacity-60
                  "
                >
                  <BiPlus size={20} />

                  <span>Create Class</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Class Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groupedClasses.map(([gradeName, gradeClasses]) => (
          <div
            key={gradeName}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                      {gradeName}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {gradeClasses.length} class sections
                    </p>
                  </div>
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
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total
                  </p>

                  <p className="text-xl font-black text-gray-800">
                    {gradeClasses.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Classes */}
            <div className="p-5 space-y-4">
              {gradeClasses.map((c) => {
                const total =
                  (c.enrollment[0]?.boys || 0) + (c.enrollment[0]?.girls || 0);

                return (
                  <div
                    key={c.id}
                    className="
                        rounded-3xl
                        border
                        border-gray-100
                        bg-gray-50
                        p-5
                        hover:bg-emerald-50/40
                        transition
                      "
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 uppercase">
                          {c.section}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Class Section
                        </p>
                      </div>

                      <div
                        className="
                            h-12
                            min-w-[52px]
                            px-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-emerald-500
                            to-green-600
                            text-white
                            font-bold
                            flex
                            items-center
                            justify-center
                            shadow-md
                          "
                      >
                        {total}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-5">
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            bg-white
                            border
                            border-gray-200
                            px-4
                            py-3
                            shadow-sm
                          "
                      >
                        <FaUsers className="text-emerald-600" />

                        <div>
                          <p className="text-xs text-gray-500">Boys</p>

                          <p className="font-bold text-gray-800">
                            {c.enrollment[0]?.boys || 0}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            bg-white
                            border
                            border-gray-200
                            px-4
                            py-3
                            shadow-sm
                          "
                      >
                        <FaUsers className="text-pink-500" />

                        <div>
                          <p className="text-xs text-gray-500">Girls</p>

                          <p className="font-bold text-gray-800">
                            {c.enrollment[0]?.girls || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={{
                            pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/enrollment`,
                            query: {
                              id: c.id,
                            },
                          }}
                          className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-white
                              border
                              border-gray-200
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-gray-700
                              shadow-sm
                              hover:bg-gray-50
                            "
                        >
                          <FaUsers />
                          Enrollment
                        </Link>

                        <Link
                          href={{
                            pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/mps`,
                            query: {
                              id: c.id,
                            },
                          }}
                          className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-white
                              border
                              border-gray-200
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-gray-700
                              shadow-sm
                              hover:bg-gray-50
                            "
                        >
                          <BiBarChartAlt2 />
                          MPS
                        </Link>

                        <Link
                          href={{
                            pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/gpa`,
                            query: {
                              id: c.id,
                            },
                          }}
                          className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-white
                              border
                              border-gray-200
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-gray-700
                              shadow-sm
                              hover:bg-gray-50
                            "
                        >
                          <BiSpreadsheet />
                          GPA
                        </Link>
                      </div>

                      {/* Delete */}
                      {profile.role === "admin" && (
                        <button
                          onClick={(e) => handleDeleteClick(e, c)}
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
                          <FaTrash size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {classes.length === 0 && (
        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-gray-200
            shadow-[0_10px_35px_rgba(0,0,0,0.05)]
            p-16
            text-center
          "
        >
          <h3 className="text-2xl font-bold text-gray-700">No Classes Yet</h3>

          <p className="text-gray-500 mt-2">
            Start by creating your first class section.
          </p>
        </div>
      )}
    </div>
  );
}
