"use client";

import { useState, useMemo } from "react";

import { BiGroup, BiMaleFemale, BiEdit } from "react-icons/bi";
import { BiBookOpen, BiCategory, BiCalendar } from "react-icons/bi";
import CreateEnrollmentModal from "./CreateEnrollmentModal";

import FullPageLoader from "../../../../../components/loader/FullPageLoader";

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

      <div className="min-h-screen bg-lis-bg pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-lis-primary   ">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full "></div>

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-lis-panel-header/10 rounded-full "></div>

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
                    
                    px-4
                    py-1.5
                    text-white
                    text-sm
                    mb-5
                  "
                >
                  Student Enrollment
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Enrollment Dashboard
                </h1>

                <p className="text-white/80 text-base mt-3 max-w-2xl">
                  Monitor learner enrollment, monthly class population, and
                  student distribution efficiently.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  {/* Boys */}
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
                          Grade {grade.toUpperCase()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Girls */}
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

                        <h3 className="text-2xl font-bold text-white mt-1">
                          {section.toUpperCase()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
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
                        <BiCalendar size={22} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/80">
                          School Year
                        </p>

                        <h3 className="text-2xl font-bold text-white mt-1">
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
              rounded-sm
              border
              border-lis-panel-border
              
              overflow-hidden
            "
          >
            {/* Header */}
            <div
              className="
                px-6
                py-5
                border-b
                border-lis-panel-border
                bg-lis-panel-header
                
                
              "
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-lis-text">
                    Monthly Enrollment
                  </h2>

                  <p className="text-sm text-lis-muted mt-1">
                    Enrollment records and learner statistics by month.
                  </p>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                {/* Head */}
                <thead>
                  <tr className="bg-lis-primary   text-white">
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
                    {profile && profile?.role !== "visitor" && (
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {sortedEnrollmentData.map((item) => (
                    <tr
                      key={item.id}
                      className="
                          border-t
                          border-lis-panel-border
                          hover:bg-lis-panel-header/40
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
                                rounded-sm
                                bg-lis-primary
                                
                                
                                text-white
                                flex
                                items-center
                                justify-center
                                
                              "
                          >
                            <BiBookOpen />
                          </div>

                          <div>
                            <p className="font-semibold text-lis-text capitalize">
                              {item.month}
                            </p>

                            <p className="text-xs text-lis-muted">
                              Enrollment Month
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Boys */}
                      <td className="px-6 py-5 text-center font-medium text-lis-text">
                        {item.boys}
                      </td>

                      {/* Girls */}
                      <td className="px-6 py-5 text-center font-medium text-lis-text">
                        {item.girls}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-sm
                              bg-lis-panel-header
                              px-4
                              py-2
                              text-sm
                              font-bold
                              text-lis-success-text
                            "
                        >
                          {item.boys + item.girls}
                        </span>
                      </td>
                      {profile && profile?.role !== "visitor" && (
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
                              rounded-sm
                              bg-lis-panel-header
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              text-lis-success-text
                              hover:bg-lis-panel-header
                              transition
                            "
                          >
                            <BiEdit />
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* Empty */}
                  {sortedEnrollmentData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-lis-text">
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
                          <p className="text-lis-muted">
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
