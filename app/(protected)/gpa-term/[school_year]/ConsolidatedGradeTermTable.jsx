"use client";

import React from "react";

import { BiBarChartAlt2, BiLayer } from "react-icons/bi";

const ConsolidatedGradeTermTable = ({ grade, schoolYear, data, term }) => {
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div
                className="
                  h-14
                  w-14
                  rounded-sm
                  bg-lis-primary

                  text-white
                  flex
                  items-center
                  justify-center

                "
              >
                <BiLayer size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-lis-text">
                  Grade {grade} — Consolidated
                </h2>

                <p className="text-sm text-lis-muted mt-1">
                  Term {term} consolidated GPA summary
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div
                className="
                  bg-white
                  border
                  border-lis-panel-border
                  rounded-sm
                  px-4
                  py-2

                "
              >
                <p className="text-xs uppercase tracking-wide text-lis-muted">
                  Subjects
                </p>

                <p className="text-lg font-bold text-lis-text">
                  {sortedData.length}
                </p>
              </div>

              <div
                className="
                  bg-lis-primary


                  rounded-sm
                  px-5
                  py-3
                  text-white

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
              <tr className="bg-lis-primary   text-white text-sm">
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
              <tr className="bg-lis-primary text-white text-sm">
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
                    border-lis-panel-border
                    hover:bg-lis-panel-header/40
                    transition
                    duration-200
                  "
                >
                  {/* Subject */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-lis-text uppercase">
                      {item.subject}
                    </p>
                  </td>

                  {/* FAILED */}
                  <td className="text-center">{item.not_meet_male}</td>

                  <td className="text-center">{item.not_meet_female}</td>

                  <td className="text-center font-bold text-lis-danger-text">
                    {item.not_meet_male + item.not_meet_female}
                  </td>

                  {/* FS */}
                  <td className="text-center">{item.fs_male}</td>

                  <td className="text-center">{item.fs_female}</td>

                  <td className="text-center font-bold text-lis-warning-text">
                    {item.fs_male + item.fs_female}
                  </td>

                  {/* SATISFACTORY */}
                  <td className="text-center">{item.s_male}</td>

                  <td className="text-center">{item.s_female}</td>

                  <td className="text-center font-bold text-lis-link">
                    {item.s_male + item.s_female}
                  </td>

                  {/* VS */}
                  <td className="text-center">{item.vs_male}</td>

                  <td className="text-center">{item.vs_female}</td>

                  <td className="text-center font-bold text-lis-success-text">
                    {item.vs_male + item.vs_female}
                  </td>

                  {/* EXCELLENT */}
                  <td className="text-center">{item.e_male}</td>

                  <td className="text-center">{item.e_female}</td>

                  <td className="text-center font-bold text-lis-link">
                    {item.e_male + item.e_female}
                  </td>
                </tr>
              ))}

              {/* Empty */}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan="100%" className="py-16 text-center">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-lis-text">
                        No Consolidated Data
                      </h3>

                      <p className="text-lis-muted">
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

export default ConsolidatedGradeTermTable;
