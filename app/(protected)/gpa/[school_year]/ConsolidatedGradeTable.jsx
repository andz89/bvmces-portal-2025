"use client";

import React from "react";

import { BiBarChartAlt2, BiLayer } from "react-icons/bi";

const ConsolidatedGradeTable = ({ grade, schoolYear, data, quarter }) => {
  // Consolidate by subject
  const consolidatedBySubject = data.reduce((acc, item) => {
    const subject = item.subject;

    if (!acc[subject]) {
      acc[subject] = {
        subject,
        not_meet_male: 0,
        not_meet_female: 0,
        fs_male: 0,
        fs_female: 0,
        s_male: 0,
        s_female: 0,
        vs_male: 0,
        vs_female: 0,
        e_male: 0,
        e_female: 0,
      };
    }

    acc[subject].not_meet_male += Number(item.not_meet_male);

    acc[subject].not_meet_female += Number(item.not_meet_female);

    acc[subject].fs_male += Number(item.fs_male);

    acc[subject].fs_female += Number(item.fs_female);

    acc[subject].s_male += Number(item.s_male);

    acc[subject].s_female += Number(item.s_female);

    acc[subject].vs_male += Number(item.vs_male);

    acc[subject].vs_female += Number(item.vs_female);

    acc[subject].e_male += Number(item.e_male);

    acc[subject].e_female += Number(item.e_female);

    return acc;
  }, {});

  const sortedData = Object.values(consolidatedBySubject).sort((a, b) =>
    a.subject.localeCompare(b.subject),
  );

  return (
    <div className="mb-10">
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div
                className="
                  h-14
                  w-14
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
                <BiLayer size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Grade {grade} — Consolidated
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Quarter {quarter} consolidated GPA summary
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  px-4
                  py-2
                  shadow-sm
                "
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Subjects
                </p>

                <p className="text-lg font-bold text-gray-800">
                  {sortedData.length}
                </p>
              </div>

              <div
                className="
                  bg-gradient-to-r
                  from-emerald-500
                  to-green-600
                  rounded-2xl
                  px-5
                  py-3
                  text-white
                  shadow-lg
                  flex
                  items-center
                  gap-2
                "
              >
                <BiBarChartAlt2 size={22} />

                <span className="font-semibold">Consolidated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Head */}
            <thead>
              {/* Main Categories */}
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm">
                <th rowSpan="2" className="px-5 py-4 text-left font-semibold">
                  SUBJECTS
                </th>

                {[
                  "FAILED",
                  "FAIRLY SATISFACTORY",
                  "SATISFACTORY",
                  "VERY SATISFACTORY",
                  "EXCELLENT",
                ].map((label) => (
                  <th
                    key={label}
                    colSpan="3"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>

              {/* M/F/T */}
              <tr className="bg-emerald-500 text-white text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <th className="px-3 py-3 text-center font-medium">M</th>

                    <th className="px-3 py-3 text-center font-medium">F</th>

                    <th className="px-3 py-3 text-center font-medium">T</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.subject}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-emerald-50/40
                    transition
                    duration-200
                  "
                >
                  {/* Subject */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800 uppercase">
                      {item.subject}
                    </p>
                  </td>

                  {/* FAILED */}
                  <td className="text-center">{item.not_meet_male}</td>

                  <td className="text-center">{item.not_meet_female}</td>

                  <td className="text-center font-bold text-red-600">
                    {item.not_meet_male + item.not_meet_female}
                  </td>

                  {/* FS */}
                  <td className="text-center">{item.fs_male}</td>

                  <td className="text-center">{item.fs_female}</td>

                  <td className="text-center font-bold text-orange-600">
                    {item.fs_male + item.fs_female}
                  </td>

                  {/* SATISFACTORY */}
                  <td className="text-center">{item.s_male}</td>

                  <td className="text-center">{item.s_female}</td>

                  <td className="text-center font-bold text-blue-600">
                    {item.s_male + item.s_female}
                  </td>

                  {/* VS */}
                  <td className="text-center">{item.vs_male}</td>

                  <td className="text-center">{item.vs_female}</td>

                  <td className="text-center font-bold text-emerald-600">
                    {item.vs_male + item.vs_female}
                  </td>

                  {/* EXCELLENT */}
                  <td className="text-center">{item.e_male}</td>

                  <td className="text-center">{item.e_female}</td>

                  <td className="text-center font-bold text-violet-600">
                    {item.e_male + item.e_female}
                  </td>
                </tr>
              ))}

              {/* Empty */}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan="100%" className="py-16 text-center">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-700">
                        No Consolidated Data
                      </h3>

                      <p className="text-gray-500">
                        There are currently no GPA records available for
                        consolidation.
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
  );
};

export default ConsolidatedGradeTable;
