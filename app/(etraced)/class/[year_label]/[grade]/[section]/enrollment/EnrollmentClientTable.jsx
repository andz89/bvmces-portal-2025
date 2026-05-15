"use client";

import { useState, useMemo } from "react";

import { BiGroup, BiMaleFemale, BiEdit } from "react-icons/bi";
import { BiBookOpen, BiCategory, BiCalendar } from "react-icons/bi";
import CreateEnrollmentModal from "./CreateEnrollmentModal";

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

import UpdateEnrollmentModal from "./UpdateEnrollmentModal";

export default function EnrollmentClientTable({
  section,
  grade,
  year_label,
  profile,
  class_id,
  enrollmentData,
}) {
  const MONTH_ORDER = [
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "march",
    "april",
  ];

  const sortedEnrollmentData = useMemo(() => {
    if (!enrollmentData) return [];

    return [...enrollmentData].sort((a, b) => {
      const aIndex = MONTH_ORDER.indexOf(a.month.toLowerCase());

      const bIndex = MONTH_ORDER.indexOf(b.month.toLowerCase());

      return aIndex - bIndex;
    });
  }, [enrollmentData]);

  const [editingRow, setEditingRow] = useState(null);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Totals
  const totalBoys = sortedEnrollmentData.reduce(
    (sum, item) => sum + (item.boys || 0),
    0,
  );

  const totalGirls = sortedEnrollmentData.reduce(
    (sum, item) => sum + (item.girls || 0),
    0,
  );

  const totalEnrollment = totalBoys + totalGirls;

  return (
    <>
      {loading && <FullPageLoader />}

      {/* Update */}
      {openUpdateModal && (
        <UpdateEnrollmentModal
          section={section}
          grade={grade}
          year_label={year_label}
          class_id={class_id}
          editingData={editingRow}
          onClose={() => {
            setOpenUpdateModal(false);

            setEditingRow(null);
          }}
        />
      )}

      <div className="min-h-screen bg-[#f4f7fb] pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              {/* Left */}
              <div>
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/10
                    backdrop-blur-md
                    px-4
                    py-1.5
                    text-white
                    text-sm
                    mb-5
                  "
                >
                  Student Enrollment
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Enrollment Dashboard
                </h1>

                <p className="text-emerald-100 text-base mt-3 max-w-2xl">
                  Monitor learner enrollment, monthly class population, and
                  student distribution efficiently.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  {/* Boys */}
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
                          Grade {grade.toUpperCase()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Girls */}
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

                        <h3 className="text-2xl font-black text-white mt-1">
                          {section.toUpperCase()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
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
                        <BiCalendar size={22} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-emerald-100">
                          School Year
                        </p>

                        <h3 className="text-2xl font-black text-white mt-1">
                          {year_label}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div
            className="
              bg-white
              rounded-[28px]
              border
              border-gray-200
              shadow-[0_10px_35px_rgba(0,0,0,0.05)]
              overflow-hidden
            "
          >
            {/* Header */}
            <div
              className="
                px-6
                py-5
                border-b
                border-gray-100
                bg-gradient-to-r
                from-emerald-50
                via-green-50
                to-white
              "
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Monthly Enrollment
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enrollment records and learner statistics by month.
                  </p>
                </div>

                <div
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-3
                    shadow-sm
                    min-w-[180px]
                  "
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total Months
                  </p>

                  <p className="text-2xl font-black text-gray-800 mt-1">
                    {sortedEnrollmentData.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                {/* Head */}
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Month
                    </th>

                    <th className=" text-center text-sm font-semibold    ">
                      <div className="flex items-center gap-2 justify-center">
                        {" "}
                        <BiGroup size={22} /> Boys
                      </div>
                    </th>

                    <th className=" text-center text-sm font-semibold  ">
                      <div className="flex items-center gap-2 justify-center">
                        <BiMaleFemale size={22} /> Girls
                      </div>
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Total
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {sortedEnrollmentData.map((item) => (
                    <tr
                      key={item.id}
                      className="
                          border-t
                          border-gray-100
                          hover:bg-emerald-50/40
                          transition
                        "
                    >
                      {/* Month */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                                h-11
                                w-11
                                rounded-2xl
                                bg-gradient-to-r
                                from-emerald-500
                                to-green-600
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-sm
                              "
                          >
                            <BiBookOpen />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800 capitalize">
                              {item.month}
                            </p>

                            <p className="text-xs text-gray-500">
                              Enrollment Month
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Boys */}
                      <td className="px-6 py-5 text-center font-medium text-gray-700">
                        {item.boys}
                      </td>

                      {/* Girls */}
                      <td className="px-6 py-5 text-center font-medium text-gray-700">
                        {item.girls}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-2xl
                              bg-emerald-50
                              px-4
                              py-2
                              text-sm
                              font-bold
                              text-emerald-700
                            "
                        >
                          {item.boys + item.girls}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => {
                            setOpenUpdateModal(true);

                            setEditingRow(item);
                          }}
                          className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-emerald-50
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              text-emerald-700
                              hover:bg-emerald-100
                              transition
                            "
                        >
                          <BiEdit />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Empty */}
                  {sortedEnrollmentData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-gray-700">
                            No Enrollment Records
                          </h3>
                          {/* Create */}
                          <CreateEnrollmentModal
                            section={section}
                            grade={grade}
                            year_label={year_label}
                            class_id={class_id}
                            enrollmentData={enrollmentData}
                          />
                          <p className="text-gray-500">
                            There are currently no enrollment records available.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
