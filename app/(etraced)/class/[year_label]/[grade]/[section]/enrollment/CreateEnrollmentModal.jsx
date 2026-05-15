"use client";

import { useState } from "react";

import { BiBookOpen, BiCalendar, BiPlus, BiX } from "react-icons/bi";

import { createEnrollment } from "./actions";

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

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
            rounded-2xl
            bg-gradient-to-r
            from-emerald-600
            to-green-600
            px-5
            py-3
            text-white
            font-semibold
            shadow-lg
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
              backdrop-blur-sm
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
                      <BiBookOpen size={30} />
                    </div>

                    <div>
                      <h2 className="text-3xl font-black text-white">
                        Create Enrollment
                      </h2>

                      <p className="text-emerald-100 mt-2">
                        Generate monthly enrollment records for the entire
                        school year.
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
              <div className="bg-[#f5f7fb] px-6 md:px-8 py-8">
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

                    {/* Records */}
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
                      <p className="text-xs uppercase text-gray-500">Months</p>

                      <h3 className="text-lg font-bold text-gray-800 mt-1">
                        {months.length} Records
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Months */}
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
                      <BiCalendar size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        School Months
                      </h3>

                      <p className="text-sm text-gray-500">
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
                          rounded-2xl
                          border
                          border-emerald-100
                          bg-gradient-to-r
                          from-emerald-50
                          to-green-50
                          px-4
                          py-4
                          text-center
                          shadow-sm
                        "
                      >
                        <p className="font-semibold text-emerald-700">
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
                  onClick={() => setOpen(false)}
                  disabled={loading}
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
