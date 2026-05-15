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

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

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
    rounded-2xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-700
    outline-none
    transition
    focus:border-emerald-500
    focus:ring-4
    focus:ring-emerald-100
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
            backdrop-blur-sm
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
              rounded-[32px]
              bg-white
              shadow-[0_25px_80px_rgba(0,0,0,0.25)]
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

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Left */}
                <div className="flex items-start gap-4">
                  <div
                    className="
                      h-16
                      w-16
                      rounded-2xl
                      bg-white/10
                      backdrop-blur-xl
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
                    <h2 className="text-3xl font-black text-white">
                      Update Enrollment
                    </h2>

                    <p className="text-emerald-100 mt-2">
                      Modify monthly learner enrollment records and class
                      population.
                    </p>
                  </div>
                </div>

                {/* School Year */}
                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-5 py-4">
                  <p className="text-xs uppercase text-emerald-100">
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
              <div className="bg-[#f5f7fb] px-6 md:px-8 py-8">
                {/* Hidden */}
                <input type="hidden" name="id" value={editingData?.id} />

                <input type="hidden" name="class_id" value={class_id} />

                {/* Summary */}
                <div
                  className="
                    rounded-3xl
                    bg-gradient-to-r
                    from-emerald-50
                    to-green-50
                    border
                    border-emerald-100
                    p-6
                    mb-8
                  "
                >
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Grade */}
                    <div
                      className="
                        rounded-2xl
                        bg-white
                        border
                        border-emerald-100
                        px-5
                        py-4
                        shadow-sm
                      "
                    >
                      <p className="text-xs uppercase text-gray-500">Grade</p>

                      <h3 className="text-lg font-bold text-gray-800 mt-1">
                        Grade {grade.toUpperCase().replace("-", " ")}
                      </h3>
                    </div>

                    {/* Section */}
                    <div
                      className="
                        rounded-2xl
                        bg-white
                        border
                        border-emerald-100
                        px-5
                        py-4
                        shadow-sm
                      "
                    >
                      <p className="text-xs uppercase text-gray-500">Section</p>

                      <h3 className="text-lg font-bold text-gray-800 mt-1 uppercase">
                        {section}
                      </h3>
                    </div>

                    {/* Month */}
                    <div
                      className="
                        rounded-2xl
                        bg-white
                        border
                        border-emerald-100
                        px-5
                        py-4
                        shadow-sm
                      "
                    >
                      <p className="text-xs uppercase text-gray-500">Month</p>

                      <h3 className="text-lg font-bold text-gray-800 mt-1 capitalize">
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
                      rounded-3xl
                      border
                      border-gray-100
                      p-6
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-3 mb-5">
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
                        <BiGroup size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Boys
                        </h3>

                        <p className="text-sm text-gray-500">Male learners</p>
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
                      rounded-3xl
                      border
                      border-gray-100
                      p-6
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="
                          h-12
                          w-12
                          rounded-2xl
                          bg-gradient-to-r
                          from-pink-500
                          to-rose-600
                          text-white
                          flex
                          items-center
                          justify-center
                          shadow-lg
                        "
                      >
                        <BiMaleFemale size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Girls
                        </h3>

                        <p className="text-sm text-gray-500">Female learners</p>
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
                      rounded-3xl
                      border
                      border-gray-100
                      p-6
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="
                          h-12
                          w-12
                          rounded-2xl
                          bg-gradient-to-r
                          from-violet-500
                          to-purple-600
                          text-white
                          flex
                          items-center
                          justify-center
                          shadow-lg
                        "
                      >
                        <BiBookOpen size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Current Total
                        </h3>

                        <p className="text-sm text-gray-500">
                          Total enrollment
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-gradient-to-r
                        from-emerald-50
                        to-green-50
                        border
                        border-emerald-100
                        px-5
                        py-6
                        text-center
                      "
                    >
                      <h2 className="text-4xl font-black text-emerald-700">
                        {total}
                      </h2>

                      <p className="text-sm text-emerald-600 mt-1">Students</p>
                    </div>
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
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-6
                    py-3
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
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
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-600
                    to-green-600
                    px-7
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
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
