"use client";

import { useState } from "react";

import { BiPlus, BiBookOpen, BiCalendar, BiX } from "react-icons/bi";

import { createBulkGPA } from "./actions";

import FullPageLoader from "@/app/components/loader/FullPageLoader";

import toast from "react-hot-toast";

export default function BulkAddGPAModal({
  open,
  onClose,
  school_year,
  class_id,
  section,
  grade,
}) {
  const [loading, setLoading] = useState(false);

  const [quarter, setQuarter] = useState("");

  if (!open) return null;

  async function handleSubmit() {
    if (!quarter) {
      toast.error("Please select a quarter.");

      return;
    }

    setLoading(true);

    try {
      await createBulkGPA({
        school_year,
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
    <div className="fixed inset-0 z-51 overflow-y-auto  ">
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
            max-w-3xl
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
                  <BiPlus size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Create GPA Records
                  </h2>

                  <p className="text-white/80 mt-2">
                    Generate GPA templates and learner performance records
                    instantly.
                  </p>
                </div>
              </div>

              {/* School Year */}
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white/10 border border-white/10  rounded-sm px-4 py-3">
                  <p className="text-xs uppercase text-white/80">
                    School Year
                  </p>

                  <p className="text-lg font-bold text-white mt-1">
                    {school_year}
                  </p>
                </div>
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
                {/* Grade */}
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
                  <p className="text-xs uppercase text-lis-muted">Grade</p>

                  <h3 className="text-lg font-bold text-lis-text mt-1">
                    Grade {grade}
                  </h3>
                </div>

                {/* Section */}
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
                  <p className="text-xs uppercase text-lis-muted">Section</p>

                  <h3 className="text-lg font-bold text-lis-text mt-1 uppercase">
                    {section}
                  </h3>
                </div>

                {/* GPA */}
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

            {/* Quarter Selection */}
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
                    Choose which quarter to generate GPA records for.
                  </p>
                </div>
              </div>

              <input readOnly type="hidden" value={class_id} />

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
              <BiBookOpen size={20} />

              <span>{loading ? "Creating..." : "Create Records"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
