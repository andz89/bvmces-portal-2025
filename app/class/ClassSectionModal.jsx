"use client";

import React, { useState, useEffect } from "react";
import { updateSection } from "./actions";
import { BiBookOpen, BiCategory, BiSave, BiX, BiEditAlt } from "react-icons/bi";
import toast from "react-hot-toast";
const ClassSectionModal = ({ open, onClose, sectionEditDetails, refresh }) => {
  useEffect(() => {
    if (sectionEditDetails?.section) {
      setNewSection(sectionEditDetails.section);
    }
  }, [sectionEditDetails]);
  const [loading, setLoading] = useState(false);

  const [newSection, setNewSection] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await updateSection({
        id: sectionEditDetails.id,
        section: newSection,
        school_year_id: sectionEditDetails.school_year_id,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }
      await refresh();
      onClose?.();
      toast.success("Adviser assigned successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] overflow-y-auto">
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
            max-w-2xl
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

            <div className="relative flex items-start justify-between gap-5">
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
                    Edit Section
                  </h2>

                  <p className="text-white/80 mt-2 max-w-md">
                    Update the class section information and manage classroom
                    organization.
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="
                  h-11
                  w-11
                  rounded-sm
                  bg-white/10
                  border
                  border-white/10
                  text-white
                  flex
                  items-center
                  justify-center
                  transition
                  hover:bg-white/20
                "
              >
                <BiX size={22} />
              </button>
            </div>

            {/* Info Cards */}
            <div className="flex flex-wrap gap-4 mt-8">
              {/* Grade */}
              <div
                className="
                  bg-white/10
                  
                  border
                  border-white/10
                  rounded-sm
                  px-5
                  py-4
                  min-w-[180px]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      h-11
                      w-11
                      rounded-sm
                      bg-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <BiBookOpen size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/80">
                      Grade
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-1">
                      {sectionEditDetails?.grade}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Current Section */}
              <div
                className="
                  bg-white/10
                  
                  border
                  border-white/10
                  rounded-sm
                  px-5
                  py-4
                  min-w-[220px]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      h-11
                      w-11
                      rounded-sm
                      bg-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <BiCategory size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/80">
                      Current Section
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-1 uppercase">
                      {sectionEditDetails?.section}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-lis-bg px-6 md:px-8 py-8">
              {/* Edit Card */}
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
                    <BiCategory size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-lis-text">
                      Section Information
                    </h3>

                    <p className="text-sm text-lis-muted">
                      Update the section name for this class.
                    </p>
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-lis-muted
                    "
                  >
                    Section Name
                  </label>

                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="Enter section name"
                    required
                    className="
                      w-full
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-white
                      px-4
                      py-4
                      text-sm
                      text-lis-text
                      outline-none
                      transition
                      focus:border-lis-primary
                      focus:ring-4
                      focus:ring-lis-primary
                    "
                  />
                </div>

                {/* Info Box */}
                <div
                  className="
                    mt-5
                    rounded-sm
                    border
                    border-lis-panel-border
                    bg-lis-panel-header
                    
                    
                    px-5
                    py-4
                  "
                >
                  <p className="text-sm font-semibold text-lis-success-text">
                    Section Update
                  </p>

                  <p className="text-sm text-lis-success-text mt-1">
                    Updating the section name will automatically reflect across
                    enrollment, GPA, MPS, and academic records.
                  </p>
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
                onClick={onClose}
                className="
                  w-full
                  sm:w-auto
                  rounded-sm
                  border
                  border-lis-panel-border
                  bg-white
                  px-6
                  py-3
                  font-medium
                  text-lis-text
                  transition
                  hover:bg-lis-panel-header
                "
              >
                Cancel
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
                  
                  transition
                  hover:scale-[1.01]
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
  );
};

export default ClassSectionModal;
