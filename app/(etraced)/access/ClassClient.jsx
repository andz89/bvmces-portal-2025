"use client";

import FullPageLoader from "../../components/loader/FullPageLoader";
import { useState } from "react";
import Link from "next/link";

export default function ClassClient({
  school_year_id,
  profile,
  year_label,
  initialData,
}) {
  function getEnrollmentTotals(enrollment = []) {
    return enrollment.reduce(
      (acc, cur) => {
        acc.boys += Number(cur.boys || 0);
        acc.girls += Number(cur.girls || 0);
        return acc;
      },
      { boys: 0, girls: 0 }
    );
  }

  function getGradeTotals(classes = []) {
    return classes.reduce(
      (acc, c) => {
        const { boys, girls } = getEnrollmentTotals(c.enrollment);
        acc.boys += boys;
        acc.girls += girls;
        return acc;
      },
      { boys: 0, girls: 0 }
    );
  }
  function normalizeGrade(grade) {
    if (!grade) return grade;

    const g = grade.toString().toUpperCase();

    if (
      g === "K" ||
      g === "KG" ||
      g === "KINDER" ||
      g === "KINDERGARTEN" ||
      g === "Kindergarten"
    ) {
      return "KINDERGARTEN";
    }

    return g;
  }
  function getGradeRank(grade) {
    if (!grade) return 999;

    const g = grade.toString().trim().toUpperCase();

    if (["K", "KG", "KINDER", "KINDERGARTEN"].includes(g)) {
      return 0;
    }

    const number = parseInt(g, 10);
    if (!isNaN(number)) return number;

    return 999; // fallback for unknown values
  }

  const [classes] = useState(initialData);
  const [loading] = useState(false);

  const gradeRank = {
    KINDERGARTEN: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  const classesByGrade = classes.reduce((acc, c) => {
    if (!acc[c.grade]) acc[c.grade] = [];
    acc[c.grade].push(c);
    return acc;
  }, {});

  const sortedGrades = Object.keys(classesByGrade).sort(
    (a, b) => getGradeRank(a) - getGradeRank(b)
  );

  function formatToday() {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function getOverallTotals(classes = []) {
    return classes.reduce(
      (acc, c) => {
        const { boys, girls } = getEnrollmentTotals(c.enrollment);
        acc.boys += boys;
        acc.girls += girls;
        return acc;
      },
      { boys: 0, girls: 0 }
    );
  }
  const overallTotals = getOverallTotals(classes);

  return (
    <div className="space-y-8">
      {loading && <FullPageLoader />}
      <div className="bg-slate-100   py-6 px-8 text-center space-y-3">
        <div className="text-sm text-gray-500">
          Enrollment Summary (Grade K–6)
        </div>

        <div className="text-sm text-gray-500">As of {formatToday()}</div>

        <div className="flex justify-center gap-14 text-lg font-semibold mt-2">
          <div>
            <div className="text-gray-600">Boys</div>
            <div className="text-3xl text-blue-700">{overallTotals.boys}</div>
          </div>

          <div>
            <div className="text-gray-600">Girls</div>
            <div className="text-3xl text-pink-700">{overallTotals.girls}</div>
          </div>

          <div>
            <div className="text-gray-600">Total</div>
            <div className="text-4xl font-bold text-slate-800">
              {overallTotals.boys + overallTotals.girls}
            </div>
          </div>
        </div>
      </div>

      {sortedGrades.map((gradeKey) => {
        const gradeTotals = getGradeTotals(classesByGrade[gradeKey]);

        return (
          <div
            key={gradeKey}
            className="border border-slate-700 rounded-md overflow-hidden"
          >
            {/* Grade Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                {gradeKey.toUpperCase()}
              </h2>
              <span className="text-xs text-slate-300">
                Sections: {classesByGrade[gradeKey].length}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm bg-white">
                <thead className="bg-slate-200 text-slate-800">
                  <tr>
                    <th className="border border-slate-600 px-4 py-2 text-left">
                      SECTION
                    </th>
                    <th className="border border-slate-600 px-4 py-2 text-center">
                      BOYS
                    </th>
                    <th className="border border-slate-600 px-4 py-2 text-center">
                      GIRLS
                    </th>
                    <th className="border border-slate-600 px-4 py-2 text-center">
                      TOTAL
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {classesByGrade[gradeKey]
                    .sort((a, b) => a.section.localeCompare(b.section))
                    .map((c) => {
                      const { boys, girls } = getEnrollmentTotals(c.enrollment);

                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="border border-slate-600 px-4 py-2 font-medium">
                            <Link
                              href={{
                                pathname: `/class/${year_label}/${
                                  c.grade
                                }/${c.section.trim()}`,
                                query: { id: c.id },
                              }}
                              className="text-blue-700 hover:underline"
                            >
                              {c.section.toUpperCase()}
                            </Link>
                          </td>

                          <td className="border border-slate-600 px-4 py-2 text-center">
                            {boys}
                          </td>

                          <td className="border border-slate-600 px-4 py-2 text-center">
                            {girls}
                          </td>

                          <td className="border border-slate-600 px-4 py-2 text-center font-semibold">
                            {boys + girls}
                          </td>
                        </tr>
                      );
                    })}

                  {/* TOTAL ROW */}
                  <tr className="bg-slate-200 font-bold">
                    <td className="border border-slate-600 px-4 py-2 text-right uppercase">
                      TOTAL
                    </td>
                    <td className="border border-slate-600 px-4 py-2 text-center">
                      {gradeTotals.boys}
                    </td>
                    <td className="border border-slate-600 px-4 py-2 text-center">
                      {gradeTotals.girls}
                    </td>
                    <td className="border border-slate-600 px-4 py-2 text-center">
                      {gradeTotals.boys + gradeTotals.girls}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {classes.length === 0 && (
        <div className="text-center text-gray-500 py-10">No classes yet</div>
      )}
    </div>
  );
}
