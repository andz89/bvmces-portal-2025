"use client";

import React, { useState } from "react";

import {
  BiUser,
  BiCheckShield,
  BiBookOpen,
  BiCategory,
  BiX,
} from "react-icons/bi";

import { toast } from "react-hot-toast";

import { assignAdviser } from "./actions";

const UsersModal = ({
  open,
  onClose,
  advisers,
  classId,
  currentAdviserClass,
  refresh,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const adviserId = formData.get("adviser");

    try {
      const res = await assignAdviser({
        classId,
        adviserId,
      });

      if (res?.error) {
        toast.error(res.error);

        return;
      }

      await refresh();
      setLoading(false);
      onClose?.();
      toast.success("Adviser assigned successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
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
                    h-12
                    w-25
                       md:h-16
                    md:w-16
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
                  <BiCheckShield size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Assign Adviser
                  </h2>

                  <p className="text-white/80 mt-2 max-w-md">
                    Assign an adviser to manage academic records, learners, and
                    classroom activities.
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

            {/* Class Info */}
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
                      Grade {currentAdviserClass.grade.toUpperCase()}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Section */}
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
                    <BiCategory size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/80">
                      Section
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-1 uppercase">
                      {currentAdviserClass.section}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Current Adviser */}
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
                    <BiUser size={22} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/80">
                      Current Adviser
                    </p>

                    <h3 className="text-lg font-bold text-white mt-1 uppercase">
                      {currentAdviserClass?.users?.full_name || "No Adviser"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-lis-bg px-6 md:px-8 py-8">
              {/* Adviser Selection */}
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
                    <BiUser size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-lis-text">
                      Select Adviser
                    </h3>

                    <p className="text-sm text-lis-muted">
                      Choose a teacher to assign for this class section.
                    </p>
                  </div>
                </div>

                <select
                  name="adviser"
                  required
                  defaultValue={currentAdviserClass?.users?.id || ""}
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
                >
                  <option value="">Select adviser</option>

                  {advisers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name.toUpperCase()} ({user.email})
                    </option>
                  ))}
                </select>

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
                    Adviser Permissions
                  </p>

                  <p className="text-sm text-lis-success-text mt-1">
                    Assigned advisers can manage enrollment, GPA, MPS, and
                    learner academic records for this class.
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

              {/* Submit */}
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
                <BiCheckShield size={20} />

                <span>{loading ? "Assigning..." : "Assign Adviser"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
