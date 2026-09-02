"use client";

import { useEffect, useState } from "react";

import {
  BiBookOpen,
  BiGroup,
  BiMaleFemale,
  BiSave,
  BiX,
  BiEditAlt,
} from "react-icons/bi";

import { createOrUpdateEnrollment } from "./actions";

import FullPageLoader from "../../../../../components/loader/FullPageLoader";

export default function UpdateEnrollmentModal({
  section,
  grade,
  year_label,
  class_id,
  editingData,
  onClose,
}) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setOpen(true);
    }
  }, [editingData]);

  async function handleSubmit(formData) {
    setLoading(true);

    try {
      await createOrUpdateEnrollment(formData, year_label, section);

      setOpen(false);

      onClose?.();
    } catch (err) {
      alert(err.message);
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

  if (!open) return null;

  const total = (editingData?.boys || 0) + (editingData?.girls || 0);

  return (
    <>
      {loading && <FullPageLoader />}

      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Overlay */}
        <div
          className="
            fixed
            inset-0
            bg-black/40
            
          "
          onClick={() => {
            setOpen(false);

            onClose?.();
          }}
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
                    <BiEditAlt size={30} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Update Enrollment
                    </h2>

                    <p className="text-white/80 mt-2">
                      Modify monthly learner enrollment records and class
                      population.
                    </p>
                  </div>
                </div>

                {/* School Year */}
                <div className="bg-white/10 border border-white/10  rounded-sm px-5 py-4">
                  <p className="text-xs uppercase text-white/80">
                    School Year
                  </p>

                  <p className="text-lg font-bold text-white mt-1">
                    {year_label}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);

                await handleSubmit(formData);
              }}
            >
              <div className="bg-lis-bg px-6 md:px-8 py-8">
                {/* Hidden */}
                <input type="hidden" name="id" value={editingData?.id} />

                <input type="hidden" name="class_id" value={class_id} />

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
                        Grade {grade.toUpperCase().replace("-", " ")}
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

                    {/* Month */}
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
                      <p className="text-xs uppercase text-lis-muted">Month</p>

                      <h3 className="text-lg font-bold text-lis-text mt-1 capitalize">
                        {editingData?.month}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Enrollment Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Boys */}
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
                        <BiGroup size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-lis-text">
                          Boys
                        </h3>

                        <p className="text-sm text-lis-muted">Male learners</p>
                      </div>
                    </div>

                    <input
                      type="number"
                      name="boys"
                      min="0"
                      required
                      defaultValue={editingData?.boys || 0}
                      className={inputClass}
                    />
                  </div>

                  {/* Girls */}
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
                        <BiMaleFemale size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-lis-text">
                          Girls
                        </h3>

                        <p className="text-sm text-lis-muted">Female learners</p>
                      </div>
                    </div>

                    <input
                      type="number"
                      name="girls"
                      min="0"
                      required
                      defaultValue={editingData?.girls || 0}
                      className={inputClass}
                    />
                  </div>

                  {/* Total */}
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
                        <h3 className="text-lg font-bold text-lis-text">
                          Current Total
                        </h3>

                        <p className="text-sm text-lis-muted">
                          Total enrollment
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        rounded-sm
                        bg-lis-panel-header
                        
                        
                        border
                        border-lis-panel-border
                        px-5
                        py-6
                        text-center
                      "
                    >
                      <h2 className="text-4xl font-bold text-lis-success-text">
                        {total}
                      </h2>

                      <p className="text-sm text-lis-success-text mt-1">Students</p>
                    </div>
                  </div>
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
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    onClose?.();
                  }}
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

                {/* Save */}
                <button
                  type="submit"
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
                  <BiSave size={20} />

                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
