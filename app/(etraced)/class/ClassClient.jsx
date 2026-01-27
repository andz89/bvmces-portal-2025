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
  role,
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
    const data = await getClasses(school_year_id, role);

    setClasses(data);
  };

  const handleCreate = async () => {
    if (!grade || !section) return;

    setLoading(true);

    const result = await createClass({
      school_year_id,

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
    setTargetClass(classItem); // 🔑 THIS WAS MISSING
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
      {role === "admin" && (
        <div className="border rounded-lg p-4 bg-gray-50 max-w-xl">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Grade */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border rounded px-3 h-10"
              >
                <option value="" disabled>
                  Select Grade
                </option>
                <option value="kindergarten">Kindergarten</option>

                <option value="grade-1">Grade 1</option>
                <option value="grade-2">Grade 2</option>
                <option value="grade-3">Grade 3</option>
                <option value="grade-4">Grade 4</option>
                <option value="grade-5">Grade 5</option>
                <option value="grade-6">Grade 6</option>
              </select>
            </div>

            {/* Section */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Section</label>
              <input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border rounded px-3 h-10"
              />
            </div>

            {/* Action */}
            <div>
              <button
                onClick={handleCreate}
                disabled={loading || !grade || !section}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...classes]

          .sort((a, b) => gradeRank[a.grade] - gradeRank[b.grade])

          .map((c) => (
            <Link
              href={{
                pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}`,
                query: { id: c.id }, //class id
              }}
              key={c.id}
            >
              <div className="relative border border-gray-400 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                {/* Delete (admin only) */}
                {role === "admin" && (
                  <button
                    onClick={(e) => handleDeleteClick(e, c)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-semibold">
                    {c.grade.toUpperCase()} – {c.section.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Boys:{c.enrollment[0]?.boys} Girls: {c.enrollment[0]?.girls}
                  </p>
                </div>
              </div>
            </Link>
          ))}

        {classes.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No classes yet
          </div>
        )}
      </div>
    </div>
  );
}
