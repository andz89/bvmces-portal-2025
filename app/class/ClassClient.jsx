"use client";

import { deleteClass } from "./actions.js";

import { FaTrash, FaUsers } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";

import {
  BiPlus,
  BiBookOpen,
  BiSpreadsheet,
  BiBarChartAlt2,
} from "react-icons/bi";

import FullPageLoader from "../components/loader/FullPageLoader.jsx";

import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";

import { useState } from "react";
import toast from "react-hot-toast";

import { createClass, getClasses, getUsers } from "./actions.js";
import ClassSectionModal from "./ClassSectionModal.jsx";
import Link from "next/link";
import UsersModal from "./UsersModal.jsx";
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
  const [adviser, setAdviser] = useState([]);

  const refresh = async () => {
    const data = await getClasses(school_year_id, profile);

    setClasses(data);
  };

  const handleCreate = async () => {
    if (!grade || !section) return;

    setLoading(true);

    try {
      const res = await createClass({
        grade,
        school_year_id,
        section: section.toLowerCase(),

        year_label,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      await refresh();
      toast.success("Adviser assigned successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
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
    rounded-sm
    border
    border-lis-panel-border
    bg-white
    px-4
    py-3
    text-sm
    text-lis-text
    outline-none
    transition
    focus:border-lis-primary
    focus:ring-4
    focus:ring-lis-primary
  `;

  const [classId, setClassId] = useState(null);
  const [currentAdviserClass, setCurrentAdviserClass] = useState(null);

  const handleUsersModal = async (classId) => {
    setLoading(true);
    let users = await getUsers(profile);

    setAdviser(users);
    setClassId(classId);
    setLoading(false);
  };
  const [sectionEditDetails, setSectionEditDetails] = useState({});

  return (
    <div className="space-y-8">
      <ClassSectionModal
        open={Object.keys(sectionEditDetails || {}).length > 0}
        onClose={() => setSectionEditDetails({})}
        sectionEditDetails={sectionEditDetails}
        refresh={refresh}
      />
      <UsersModal
        open={adviser.length > 0}
        onClose={() => setAdviser(false)}
        advisers={adviser}
        classId={classId}
        currentAdviserClass={currentAdviserClass}
        refresh={refresh}
      />
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
      {profile?.role === "admin" && (
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
            <div className="flex items-center gap-4">
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
                <BiPlus size={28} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-lis-heading">
                  Create New Class
                </h2>

                <p className="text-sm text-lis-muted mt-1">
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
                <label className="block text-sm font-medium text-lis-muted mb-2">
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
                <label className="block text-sm font-medium text-lis-muted mb-2">
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
                    rounded-sm
                    bg-lis-primary
                    
                    
                    px-5
                    py-3
                    text-white
                    font-semibold
                    
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                    <h2 className="text-lg font-semibold text-lis-heading">
                      {gradeName}
                    </h2>

                    <p className="text-sm text-lis-muted mt-1">
                      {gradeClasses.length} class sections
                    </p>
                  </div>
                </div>

                <div
                  className="
                      bg-white
                      border
                      border-lis-success
                      rounded-sm
                      px-4
                      py-2

                    "
                >
                  <p className="text-xs uppercase tracking-wide text-lis-muted">
                    Total
                  </p>

                  <p className="text-xl font-bold text-lis-success-text">
                    {gradeClasses.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Classes */}
            <div className="p-2 space-y-4">
              {gradeClasses.map((c) => {
                const total =
                  (c.enrollment[0]?.boys || 0) + (c.enrollment[0]?.girls || 0);

                return (
                  <div
                    key={c.id}
                    className="
                        rounded-sm
                        border
                        border-lis-panel-border
                        bg-lis-panel-header
                        p-3
                        hover:bg-lis-panel-header/40
                        transition
                      "
                  >
                    {/* Top */}
                    <div className="flex  justify-between gap-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <h3 className="text-md font-bold text-lis-text uppercase">
                              {c.grade === "kindergarten" ? " " : "Grade"}{" "}
                              {c.grade} - {c.section}
                            </h3>

                            <button
                              onClick={() => setSectionEditDetails(c)}
                              className="
      h-7
      w-7
      md:h-8
      md:w-8
      rounded-sm
    
     text-lis-muted
      flex
      items-center
      justify-center
      hover:bg-lis-panel-header
      cursor-pointer
      transition
    "
                            >
                              <BiEdit size={20} />
                            </button>
                          </div>

                          {/* Delete */}
                          {profile.role === "admin" && (
                            <button
                              onClick={(e) => handleDeleteClick(e, c)}
                              className="
      h-7
      w-7
      md:h-8
      md:w-8
      rounded-sm
       
      text-lis-danger-text
      flex
      items-center
      justify-center
      hover:bg-lis-danger-bg
      cursor-pointer
      transition
    "
                            >
                              <FaTrash size={15} />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-lis-muted py-1 px-2 rounded">
                            {" "}
                            {c.users?.full_name.toUpperCase() ||
                              "No adviser assigned"}{" "}
                          </span>
                          <button
                            className="text-xs uppercase tracking-wide text-lis-muted py-1 px-2 rounded"
                            onClick={() => {
                              (handleUsersModal(c.id),
                                setCurrentAdviserClass(c));
                            }}
                          >
                            <BiEdit size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center md:gap-2 gap-1 mt-5 ">
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-sm
                            bg-white
                            border
                            border-lis-panel-border
                            px-3
                            py-3
                            
                          "
                      >
                        <FaUsers className="text-lis-muted" />

                        <div>
                          <p className="text-xs text-lis-muted">Boys</p>

                          <p className="font-bold text-lis-text">
                            {c.enrollment[0]?.boys || 0}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-sm
                            bg-white
                            border
                            border-lis-panel-border
                            px-4
                            py-3

                          "
                      >
                        <FaUsers className="text-lis-muted" />

                        <div>
                          <p className="text-xs text-lis-muted">Girls</p>

                          <p className="font-bold text-lis-text">
                            {c.enrollment[0]?.girls || 0}
                          </p>
                        </div>
                      </div>
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-sm
                            bg-white
                            border
                            border-lis-success
                            px-4
                            py-3

                          "
                      >
                        <FaUsers className="text-lis-success" />

                        <div>
                          <p className="text-xs text-lis-muted">Total</p>

                          <p className="font-bold text-lis-success-text">{total}</p>
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
                              rounded-sm
                              bg-white
                              border
                              border-lis-panel-border
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-lis-text
                              
                              hover:bg-lis-panel-header
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
                              rounded-sm
                              bg-white
                              border
                              border-lis-panel-border
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-lis-text
                              
                              hover:bg-lis-panel-header
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
                              rounded-sm
                              bg-white
                              border
                              border-lis-panel-border
                              px-4
                              py-2.5
                              text-sm
                              font-medium
                              text-lis-text
                              
                              hover:bg-lis-panel-header
                            "
                        >
                          <BiSpreadsheet />
                          GPA
                        </Link>
                      </div>
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
            rounded-sm
            border
            border-lis-panel-border
            
            p-16
            text-center
          "
        >
          <h3 className="text-lg font-semibold text-lis-heading">No Classes Yet</h3>

          <p className="text-lis-muted mt-2">
            Start by creating your first class section.
          </p>
        </div>
      )}
    </div>
  );
}
