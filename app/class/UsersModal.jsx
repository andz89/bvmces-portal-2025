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
          backdrop-blur-sm
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
            rounded-[32px]
            bg-white
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-teal-600
              px-8
              py-7
            "
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative flex items-start justify-between gap-5">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    h-12
                    w-25
                       md:h-16
                    md:w-16
                    rounded-3xl
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-sm
                 
                  "
                >
                  <BiCheckShield size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white">
                    Assign Adviser
                  </h2>

                  <p className="text-emerald-100 mt-2 max-w-md">
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
                  rounded-2xl
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
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-2xl
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
                      rounded-xl
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
                    <p className="text-xs uppercase tracking-wide text-emerald-100">
                      Grade
                    </p>

                    <h3 className="text-2xl font-black text-white mt-1">
                      Grade {currentAdviserClass.grade.toUpperCase()}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Section */}
              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-2xl
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
                      rounded-xl
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
                    <p className="text-xs uppercase tracking-wide text-emerald-100">
                      Section
                    </p>

                    <h3 className="text-2xl font-black text-white mt-1 uppercase">
                      {currentAdviserClass.section}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Current Adviser */}
              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-2xl
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
                      rounded-xl
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
                    <p className="text-xs uppercase tracking-wide text-emerald-100">
                      Current Adviser
                    </p>

                    <h3 className="text-lg font-black text-white mt-1 uppercase">
                      {currentAdviserClass?.users?.full_name || "No Adviser"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-[#f5f7fb] px-6 md:px-8 py-8">
              {/* Adviser Selection */}
              <div
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-100
                  p-6
                  shadow-sm
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="
                      h-12
                      w-12
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
                    <BiUser size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Select Adviser
                    </h3>

                    <p className="text-sm text-gray-500">
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
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-4
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-100
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
                    rounded-2xl
                    border
                    border-emerald-100
                    bg-gradient-to-r
                    from-emerald-50
                    to-green-50
                    px-5
                    py-4
                  "
                >
                  <p className="text-sm font-semibold text-emerald-700">
                    Adviser Permissions
                  </p>

                  <p className="text-sm text-emerald-600 mt-1">
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
                border-gray-100
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
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  px-6
                  py-3
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-100
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
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-600
                  to-green-600
                  px-7
                  py-3
                  font-semibold
                  text-white
                  shadow-lg
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
