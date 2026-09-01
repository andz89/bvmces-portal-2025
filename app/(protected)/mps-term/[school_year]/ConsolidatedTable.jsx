"use client";

import { BiExport, BiBarChartAlt2 } from "react-icons/bi";

import { exportToExcel } from "../utils/exportAsExcel.js";

const ConsolidatedTable = ({ title, mps }) => {
  const consolidatedData = Object.values(
    mps.reduce((acc, item) => {
      const grade = item.class.grade;

      if (!acc[grade]) {
        acc[grade] = {
          grade,
          gmrc: [],
          epp: [],
          filipino: [],
          english: [],
          math: [],
          science: [],
          ap: [],
          mapeh: [],
          reading_literacy: [],
        };
      }

      const subjects = [
        "gmrc",
        "epp",
        "filipino",
        "english",
        "math",
        "science",
        "ap",
        "mapeh",
        "reading_literacy",
      ];

      subjects.forEach((subject) => {
        const value = Number(item[subject]);

        if (!isNaN(value) && value > 0) {
          acc[grade][subject].push(value);
        }
      });

      return acc;
    }, {}),
  ).map((item) => {
    const averageSubject = (arr) => {
      if (!arr.length) return "-";

      return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
    };

    const subjectValues = [
      averageSubject(item.gmrc),
      averageSubject(item.epp),
      averageSubject(item.filipino),
      averageSubject(item.english),
      averageSubject(item.math),
      averageSubject(item.science),
      averageSubject(item.ap),
      averageSubject(item.mapeh),
      averageSubject(item.reading_literacy),
    ]
      .filter((v) => v !== "-")
      .map(Number);

    const overallAverage =
      subjectValues.length > 0
        ? (
            subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length
          ).toFixed(2)
        : "-";

    return {
      grade: item.grade,
      gmrc: averageSubject(item.gmrc),
      epp: averageSubject(item.epp),
      filipino: averageSubject(item.filipino),
      english: averageSubject(item.english),
      math: averageSubject(item.math),
      science: averageSubject(item.science),
      ap: averageSubject(item.ap),
      mapeh: averageSubject(item.mapeh),
      reading_literacy: averageSubject(item.reading_literacy),
      average: overallAverage,
    };
  });

  return (
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
          from-violet-50
          via-indigo-50
          to-white
        "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-gradient-to-r
                from-violet-500
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <BiBarChartAlt2 size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

              <p className="text-sm text-gray-500 mt-1">
                Consolidated academic performance summary by grade level
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
                text-center
              "
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Records
              </p>

              <p className="text-lg font-bold text-gray-800">
                {consolidatedData.length}
              </p>
            </div>

            <button
              onClick={() => exportToExcel(consolidatedData, false)}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                px-5
                py-3
                text-white
                font-semibold
                shadow-lg
                transition
                hover:scale-[1.02]
              "
            >
              <BiExport size={20} />

              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          {/* Head */}
          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-[11px]">
              <th className="px-2 py-2 text-left font-semibold">Grade</th>

              {[
                "GMRC",
                "EPP",
                "Filipino",
                "English",
                "Math",
                "Science",
                "AP",
                "MAPEH",
                "Reading",
              ].map((subject) => (
                <th
                  key={subject}
                  className="px-1.5 py-2 text-center font-semibold"
                >
                  {subject}
                </th>
              ))}

              <th className="px-1.5 py-2 text-center font-semibold">Avg</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {consolidatedData.map((item) => (
              <tr
                key={item.grade}
                className="
                  border-t
                  border-gray-100
                  hover:bg-violet-50/40
                  transition
                  duration-200
                "
              >
                {/* Grade */}
                <td className="px-2 py-2">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                    "
                  >
                    <div
                      className="
                        h-7
                        w-7
                        rounded-lg
                        bg-gradient-to-r
                        from-blue-500
                        to-indigo-600
                        text-white
                        font-bold
                        text-xs
                        flex
                        items-center
                        justify-center
                        shadow-sm
                      "
                    >
                      {item.grade}
                    </div>

                    <p className="font-semibold text-gray-800 text-xs whitespace-nowrap">
                      Grade {item.grade}
                    </p>
                  </div>
                </td>

                {/* Subject Scores */}
                {[
                  item.gmrc,
                  item.epp,
                  item.filipino,
                  item.english,
                  item.math,
                  item.science,
                  item.ap,
                  item.mapeh,
                  item.reading_literacy,
                ].map((score, idx) => (
                  <td key={idx} className="px-1.5 py-2 text-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[38px]
                        h-7
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        font-semibold
                        text-xs
                      "
                    >
                      {score}
                    </div>
                  </td>
                ))}

                {/* Average */}
                <td className="px-1.5 py-2 text-center">
                  <div
                    className="
                      inline-flex
                      items-center
                      justify-center
                      min-w-[48px]
                      h-7
                      rounded-lg
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                      text-white
                      font-bold
                      text-xs
                      shadow-md
                    "
                  >
                    {item.average}
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty */}
            {consolidatedData.length === 0 && (
              <tr>
                <td colSpan="100%" className="py-16 text-center">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-700">
                      No Consolidated Data
                    </h3>

                    <p className="text-gray-500">
                      There are currently no records available for
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
  );
};

export default ConsolidatedTable;
