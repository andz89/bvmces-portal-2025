"use client";

import { useState } from "react";

import {
  BiBookOpen,
  BiCalendar,
  BiCategory,
  BiPlus,
  BiX,
  BiSpreadsheet,
} from "react-icons/bi";

import { createBulkGPA } from "./actions";

import FullPageLoader from "../../../components/loader/FullPageLoader";

import toast from "react-hot-toast";

const SUBJECTS = [
  "gmrc",
  "epp/MTB",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading",
];

const QUARTERS = ["1", "2", "3", "4"];

export default function BulkAddGPAModal({
  open,
  onClose,
  school_year,
  classData,
}) {
  const [loading, setLoading] = useState(false);

  const [quarter, setQuarter] = useState("");

  const [section, setSection] = useState("");

  const [grade, setGrade] = useState("");

  const [class_id, setClassId] = useState("");

  const [schoolYear, setSchoolYear] = useState(school_year || "");

  if (!open) return null;

  async function handleSubmit() {
    if (!quarter) {
      toast.error("Please select a quarter.");

      return;
    }

    setLoading(true);

    try {
      await createBulkGPA({
        school_year: schoolYear,
        section,
        grade,
        quarter,
        class_id,
      });

      toast.success("GPA created successfully.");

      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="fixed inset-0 z-[51] overflow-y-auto">
      {loading && <FullPageLoader />}

      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/40
          
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="
            relative
            w-full
            max-w-4xl
            overflow-hidden
            rounded-sm
            bg-white
            
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              bg-lis-primary
              
              
              
              px-8
              py-7
            "
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full "></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    h-16
                    w-16
                    rounded-sm
                    bg-white/10
                    
                    border
                    border-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  <BiSpreadsheet size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Create GPA Records
                  </h2>

                  <p className="text-white/80 mt-2">
                    Generate learner GPA templates and quarterly academic
                    records.
                  </p>
                </div>
              </div>

              {/* School Year */}
              <div className="bg-white/10 border border-white/10  rounded-sm px-5 py-4">
                <p className="text-xs uppercase text-white/80">
                  School Year
                </p>

                <p className="text-lg font-bold text-white mt-1">
                  {schoolYear}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-lis-bg px-6 md:px-8 py-8">
            {/* Summary */}
            <div
              className="
                rounded-sm
                bg-lis-panel-header
                border
                border-lis-panel-border
                p-6
                mb-8
              "
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Subjects */}
                <div
                  className="
                    rounded-sm
                    bg-white
                    border
                    border-lis-panel-border
                    px-5
                    py-4
                    
                  "
                >
                  <p className="text-xs uppercase text-lis-muted">Subjects</p>

                  <h3 className="text-lg font-bold text-lis-text mt-1">
                    {SUBJECTS.length} Subjects
                  </h3>
                </div>

                {/* Quarters */}
                <div
                  className="
                    rounded-sm
                    bg-white
                    border
                    border-lis-panel-border
                    px-5
                    py-4
                    
                  "
                >
                  <p className="text-xs uppercase text-lis-muted">
                    Available Quarters
                  </p>

                  <h3 className="text-lg font-bold text-lis-text mt-1">
                    {QUARTERS.length} Quarters
                  </h3>
                </div>

                {/* Record Type */}
                <div
                  className="
                    rounded-sm
                    bg-white
                    border
                    border-lis-panel-border
                    px-5
                    py-4
                    
                  "
                >
                  <p className="text-xs uppercase text-lis-muted">Record Type</p>

                  <h3 className="text-lg font-bold text-lis-text mt-1">GPA</h3>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <div
                className="
                  bg-white
                  rounded-sm
                  border
                  border-lis-panel-border
                  p-6
                  
                "
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="
                      h-12
                      w-12
                      rounded-sm
                      bg-lis-primary
                      
                      
                      text-white
                      flex
                      items-center
                      justify-center
                      
                    "
                  >
                    <BiBookOpen size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-lis-text">
                      Select Class
                    </h3>

                    <p className="text-sm text-lis-muted">
                      Choose the class section for GPA generation.
                    </p>
                  </div>
                </div>

                <select
                  name="class_id"
                  className={inputClass}
                  autoFocus={false}
                  onChange={(e) => {
                    setClassId(e.target.value);

                    const selected = classData.classes?.find(
                      (item) => item.id === e.target.value,
                    );

                    if (selected) {
                      setGrade(selected.grade);

                      setSection(selected.section);
                    }
                  }}
                >
                  <option value="">Select Class</option>

                  {classData.classes?.map((item) => (
                    <option key={item.id} value={item.id}>
                      GRADE {item.grade.toUpperCase()} —{" "}
                      {item.section.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quarter */}
              <div
                className="
                  bg-white
                  rounded-sm
                  border
                  border-lis-panel-border
                  p-6
                  
                "
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="
                      h-12
                      w-12
                      rounded-sm
                      bg-lis-primary
                      
                      
                      text-white
                      flex
                      items-center
                      justify-center
                      
                    "
                  >
                    <BiCalendar size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-lis-text">
                      Select Quarter
                    </h3>

                    <p className="text-sm text-lis-muted">
                      Choose which quarter to create GPA records for.
                    </p>
                  </div>
                </div>

                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Quarter</option>

                  <option value="1">1st Quarter</option>

                  <option value="2">2nd Quarter</option>

                  <option value="3">3rd Quarter</option>

                  <option value="4">4th Quarter</option>
                </select>
              </div>
            </div>

            {/* Selected Info */}
            {(grade || section) && (
              <div
                className="
                  mt-8
                  bg-white
                  rounded-sm
                  border
                  border-lis-panel-border
                  p-6
                  
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="
                      h-12
                      w-12
                      rounded-sm
                      bg-lis-primary
                      
                      
                      text-white
                      flex
                      items-center
                      justify-center
                      
                    "
                  >
                    <BiCategory size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-lis-text">
                      Selected Class
                    </h3>

                    <p className="text-sm text-lis-muted">
                      GPA records will be generated for this class section.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Grade */}
                  <div
                    className="
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-lis-panel-header
                      px-5
                      py-4
                    "
                  >
                    <p className="text-xs uppercase text-lis-success-text">Grade</p>

                    <h3 className="text-lg font-bold text-lis-text mt-1">
                      Grade {grade.toUpperCase()}
                    </h3>
                  </div>

                  {/* Section */}
                  <div
                    className="
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-lis-panel-header
                      px-5
                      py-4
                    "
                  >
                    <p className="text-xs uppercase text-lis-success-text">
                      Section
                    </p>

                    <h3 className="text-lg font-bold text-lis-text mt-1 uppercase">
                      {section}
                    </h3>
                  </div>

                  {/* School Year */}
                  <div
                    className="
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-lis-panel-header
                      px-5
                      py-4
                    "
                  >
                    <p className="text-xs uppercase text-lis-success-text">
                      School Year
                    </p>

                    <h3 className="text-lg font-bold text-lis-text mt-1">
                      {schoolYear}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="
              border-t
              border-lis-panel-border
              bg-white
              px-6
              md:px-8
              py-5
              flex
              flex-col
              sm:flex-row
              items-center
              justify-end
              gap-3
            "
          >
            {/* Cancel */}
            <button
              onClick={onClose}
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-sm
                border
                border-lis-panel-border
                bg-white
                px-6
                py-3
                font-medium
                text-lis-text
                hover:bg-lis-panel-header
                transition
              "
            >
              <BiX size={20} />

              <span>Cancel</span>
            </button>

            {/* Create */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-sm
                bg-lis-primary
                
                
                px-7
                py-3
                font-semibold
                text-white
                
                hover:scale-[1.01]
                transition
                disabled:opacity-60
              "
            >
              <BiPlus size={20} />

              <span>{loading ? "Creating..." : "Create Records"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
