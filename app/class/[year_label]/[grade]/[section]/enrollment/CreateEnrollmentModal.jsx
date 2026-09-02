"use client";

import { useState } from "react";

import { BiBookOpen, BiCalendar, BiPlus, BiX } from "react-icons/bi";

import { createEnrollment } from "./actions";

import FullPageLoader from "../../../../../components/loader/FullPageLoader";

export default function CreateEnrollmentModal({
  section,
  grade,
  year_label,
  class_id,
  enrollmentData,
}) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);

    try {
      await createEnrollment(class_id, year_label, section);

      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const months = [
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
  ];

  return (
    <>
      {/* Button */}
      {enrollmentData && enrollmentData.length > 0 ? null : (
        <button
          onClick={() => setOpen(true)}
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
            
            hover:scale-[1.02]
            transition
          "
        >
          <BiPlus size={20} />

          <span>Create Enrollment</span>
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {loading && <FullPageLoader />}

          {/* Overlay */}
          <div
            className="
              fixed
              inset-0
              bg-black/40
              
            "
            onClick={() => setOpen(false)}
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
                      <BiBookOpen size={30} />
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Create Enrollment
                      </h2>

                      <p className="text-white/80 mt-2">
                        Generate monthly enrollment records for the entire
                        school year.
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

                    {/* Records */}
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
                      <p className="text-xs uppercase text-lis-muted">Months</p>

                      <h3 className="text-lg font-bold text-lis-text mt-1">
                        {months.length} Records
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Months */}
                <div
                  className="
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
                      <BiCalendar size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-lis-text">
                        School Months
                      </h3>

                      <p className="text-sm text-lis-muted">
                        Monthly enrollment records to be generated
                        automatically.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {months.map((month) => (
                      <div
                        key={month}
                        className="
                          rounded-sm
                          border
                          border-lis-panel-border
                          bg-lis-panel-header
                          
                          
                          px-4
                          py-4
                          text-center
                          
                        "
                      >
                        <p className="font-semibold text-lis-success-text">
                          {month}
                        </p>
                      </div>
                    ))}
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
                  onClick={() => setOpen(false)}
                  disabled={loading}
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
                  onClick={handleCreate}
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

                  <span>{loading ? "Creating..." : "Create Enrollment"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
