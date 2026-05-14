"use client";
import { deleteClass } from "./actions";
import { FaTrash } from "react-icons/fa";
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
  const [targetId, setTargetId] = useState(null);
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
      setLoading(false);
    } else {
      if (result.message === "23505") {
        alert("Class already exists.");
      } else {
        alert("Error creating class. Please try again.");
      }
      setLoading(false);
    }
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
    setDeleteError("");

    const result = await deleteClass(targetClass.id, password);

    if (result.message === "true") {
      await refresh();
      setOpenDelete(false);
    } else if (result.message === "invalid_password") {
      setDeleteError("Invalid password. Please try again.");
    } else {
      setDeleteError("Failed to delete class. Please try again.");
    }

    setLoading(false);
  };

  const gradeRank = {
    Kinder: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  return (
    <div className="space-y-6">
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        error={deleteError}
        description={
          targetClass
            ? `Delete ${targetClass.grade.toUpperCase()} – Section ${targetClass.section.toUpperCase()}? This will permanently remove the class and all related records.`
            : ""
        }
      />

      {loading && <FullPageLoader />}
      {/* Create */}
      {profile.role === "admin" && (
        <div className="border border-gray-300 rounded bg-white overflow-hidden max-w-3xl">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-3">
            <h2 className="text-base font-semibold text-gray-700">
              Create New Class
            </h2>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Grade */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Grade</label>

                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="
            border
            border-gray-300
            rounded
            px-3
            h-10
            bg-white
            text-sm
            focus:outline-none
            focus:border-blue-500
          "
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
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Section</label>

                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="Enter Section"
                  className="
            border
            border-gray-300
            rounded
            px-3
            h-10
            text-sm
            focus:outline-none
            focus:border-blue-500
          "
                />
              </div>

              {/* Action */}
              <div>
                <button
                  onClick={handleCreate}
                  disabled={loading || !grade || !section}
                  className="
            w-full
            border
            border-gray-300
            bg-gradient-to-b
            from-white
            to-gray-100
            text-gray-700
            px-4
            py-2
            rounded
            text-sm
            hover:bg-gray-50
            disabled:opacity-50
          "
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-8   flex flex-wrap">
        {Object.entries(
          [...classes]
            .sort((a, b) => gradeRank[a.grade] - gradeRank[b.grade])
            .reduce((acc, curr) => {
              const gradeLabel =
                curr.grade === "kindergarten"
                  ? "Kinder"
                  : `Grade ${curr.grade}`;

              if (!acc[gradeLabel]) {
                acc[gradeLabel] = [];
              }

              acc[gradeLabel].push(curr);

              return acc;
            }, {}),
        ).map(([gradeName, gradeClasses]) => (
          <div
            key={gradeName}
            className="
        border
        border-gray-300
        rounded
        bg-white
        overflow-hidden
        mx-2
        h-full
    w-full
    sm:w-full
    lg:w-[48%]
 
      "
          >
            {/* Grade Header */}
            <div className="bg-gray-100 border-b border-gray-300 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-700">
                {gradeName}
              </h2>
            </div>

            {/* Class List */}
            <div className=" divide-gray-200  w-full">
              {gradeClasses.map((c) => (
                <div
                  key={c.id}
                  className="
                flex
                flex-col
                items-start
                
                px-2
                py-4
                hover:bg-gray-50
                transition
              "
                >
                  {/* Left */}
                  <div className="w-full  ">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-blue-900 font-bold text-sm uppercase">
                        {c.section.toUpperCase()}
                      </h3>

                      {/* Total */}
                      <div
                        className="
                   
                    h-6
                    px-2
                    rounded
                    bg-gray-500
                    text-white
                    text-xs
                    font-semibold
                    flex
                    items-center
                    justify-center
                  "
                      >
                        {(c.enrollment[0]?.boys || 0) +
                          (c.enrollment[0]?.girls || 0)}
                      </div>
                    </div>

                    <div className="my-1">
                      <p className="text-sm text-gray-500 mt-1">
                        Boys: {c.enrollment[0]?.boys || 0} | Girls:{" "}
                        {c.enrollment[0]?.girls || 0}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex gap-1">
                      <Link
                        href={{
                          pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/enrollment`,
                          query: { id: c.id },
                        }}
                        className="
                    border
                    border-gray-300
                    bg-gradient-to-b
                    from-white
                    to-gray-100
                    text-xs
                    px-2
                    py-1 
                    rounded
                    hover:bg-gray-50
                  "
                      >
                        Enrollment
                      </Link>

                      <Link
                        href={{
                          pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/mps`,
                          query: { id: c.id },
                        }}
                        className="
                    border
                    border-gray-300
                    bg-gradient-to-b
                    from-white
                    to-gray-100
                    text-xs
                    px-2
                    py-1 
                    rounded
                    hover:bg-gray-50
                  "
                      >
                        MPS
                      </Link>
                      <Link
                        href={{
                          pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/gpa`,
                          query: { id: c.id },
                        }}
                        className="
                    border
                    border-gray-300
                    bg-gradient-to-b
                    from-white
                    to-gray-100
                    text-xs
                    px-2
                    py-1 
                    rounded
                    hover:bg-gray-50
                  "
                      >
                        GPA
                      </Link>
                    </div>

                    {/* Delete */}
                    {profile.role === "admin" && (
                      <button
                        onClick={(e) => handleDeleteClick(e, c)}
                        className="
                      text-gray-500
                      hover:text-red-700
                    "
                      >
                        <FaTrash size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-10 text-gray-500">No classes yet</div>
        )}
      </div>
    </div>
  );
}
