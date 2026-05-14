"use client";

import FullPageLoader from "../../components/loader/FullPageLoader";
import { useState } from "react";
import Link from "next/link";
import EnrollmentForm from "./EnrollmentForm";
import { FiUsers, FiUser, FiBookOpen, FiArrowRight } from "react-icons/fi";

export default function ClassClient({ year_label, initialData, year_status }) {
  const [showFormEnrollment, setShowFormEnrollment] = useState(false);
  function getEnrollmentTotals(enrollment = []) {
    return enrollment.reduce(
      (acc, cur) => {
        acc.boys += Number(cur.boys || 0);
        acc.girls += Number(cur.girls || 0);

        return acc;
      },
      { boys: 0, girls: 0 },
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
      { boys: 0, girls: 0 },
    );
  }

  function getGradeRank(grade) {
    if (!grade) return 999;

    const g = grade.toString().trim().toUpperCase();

    if (["K", "KG", "KINDER", "KINDERGARTEN"].includes(g)) {
      return 0;
    }

    const number = parseInt(g, 10);

    if (!isNaN(number)) return number;

    return 999;
  }

  const [classes] = useState(initialData);
  const [loading] = useState(false);

  const classesByGrade = classes.reduce((acc, c) => {
    if (!acc[c.grade]) acc[c.grade] = [];

    acc[c.grade].push(c);

    return acc;
  }, {});

  const sortedGrades = Object.keys(classesByGrade).sort(
    (a, b) => getGradeRank(a) - getGradeRank(b),
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
      { boys: 0, girls: 0 },
    );
  }

  const overallTotals = getOverallTotals(classes);

  return (
    <div className=" ">
      {loading && <FullPageLoader />}
      {showFormEnrollment && (
        <EnrollmentForm onClose={() => setShowFormEnrollment(false)} />
      )}
      {/* Summary */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        <div className="relative p-6 md:p-8">
          <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-slate-200 backdrop-blur">
              <FiUsers />
              Enrollment Overview
            </div>

            <h2 className="mt-5 text-3xl font-bold text-white">
              Enrollment Summary
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Grade K–6{" "}
              {year_status === "active" ? `• As of ${formatToday()}` : ""}
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Boys</p>

                    <h3 className="mt-2 text-4xl font-bold text-white">
                      {overallTotals.boys}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-blue-500/20 p-3 text-white">
                    <FiUser size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pink-100">Girls</p>

                    <h3 className="mt-2 text-4xl font-bold text-white">
                      {overallTotals.girls}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-pink-500/20 p-3 text-white">
                    <FiUser size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-100">Total</p>

                    <h3 className="mt-2 text-4xl font-bold text-white">
                      {overallTotals.boys + overallTotals.girls}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-white">
                    <FiUsers size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-auto rounded-3xl border border-slate-200 bg-white shadow-sm my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-200 px-4 py-3 text-left">
                Enrollment
              </th>

              {["K", "G1", "G2", "G3", "G4", "G5", "G6"].map((grade) => (
                <th
                  key={grade}
                  className="border border-gray-200 px-4 py-3 text-center"
                >
                  {grade}
                </th>
              ))}

              <th className="border border-gray-200 px-4 py-3 text-center">
                T
              </th>
            </tr>
          </thead>

          <tbody>
            {["Total"].map((rowLabel) => {
              let grandBoys = 0;
              let grandGirls = 0;

              return (
                <tr key={rowLabel}>
                  <td className="border border-gray-200 px-4 py-4 font-medium bg-gray-50">
                    {rowLabel}
                  </td>

                  {["K", "1", "2", "3", "4", "5", "6"].map((grade) => {
                    const filtered = classes.filter((c) => {
                      if (grade === "K") return c.grade === "kinder";

                      return c.grade === grade;
                    });

                    const boys = filtered.reduce((sum, item) => {
                      const latest = item.enrollment?.[0];

                      return sum + (latest?.boys || 0);
                    }, 0);

                    const girls = filtered.reduce((sum, item) => {
                      const latest = item.enrollment?.[0];

                      return sum + (latest?.girls || 0);
                    }, 0);

                    grandBoys += boys;
                    grandGirls += girls;

                    return (
                      <td
                        key={grade}
                        className="border border-gray-200 px-4 py-3 text-center"
                      >
                        <div className="space-y-1">
                          <div>
                            <span className="text-gray-400 mr-1">M</span>
                            <span className="font-medium">{boys}</span>
                          </div>

                          <div>
                            <span className="text-gray-400 mr-1">F</span>
                            <span className="font-medium">{girls}</span>
                          </div>

                          <div>
                            <span className="text-gray-400 mr-1">T</span>
                            <span className="font-semibold">
                              {boys + girls}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  {/* Grand Total */}
                  <td className="border border-gray-200 px-4 py-3 text-center bg-gray-50">
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-400 mr-1">M</span>
                        <span className="font-medium">{grandBoys}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 mr-1">F</span>
                        <span className="font-medium">{grandGirls}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 mr-1">T</span>
                        <span className="font-semibold">
                          {grandBoys + grandGirls}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Grades */}
      {sortedGrades.map((gradeKey) => {
        const gradeTotals = getGradeTotals(classesByGrade[gradeKey]);

        return (
          <div
            key={gradeKey}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm my-3"
          >
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <FiBookOpen size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Grade {gradeKey}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {classesByGrade[gradeKey].length} Sections
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                Total Students:{" "}
                <span className="font-bold text-slate-800">
                  {gradeTotals.boys + gradeTotals.girls}
                </span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-100 text-sm text-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Section
                    </th>

                    <th className="px-6 py-4 text-center font-semibold">
                      Boys
                    </th>

                    <th className="px-6 py-4 text-center font-semibold">
                      Girls
                    </th>

                    <th className="px-6 py-4 text-center font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {classesByGrade[gradeKey]
                    .sort((a, b) => a.section.localeCompare(b.section))
                    .map((c) => {
                      const { boys, girls } = getEnrollmentTotals(c.enrollment);

                      return (
                        <tr
                          key={c.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={{
                                pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/enrollment`,
                                query: { id: c.id },
                              }}
                              className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
                            >
                              {c.section.toUpperCase()}

                              <FiArrowRight />
                            </Link>
                          </td>

                          <td className="px-6 py-4 text-center">{boys}</td>

                          <td className="px-6 py-4 text-center">{girls}</td>

                          <td className="px-6 py-4 text-center font-bold text-slate-800">
                            {boys + girls}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {classesByGrade[gradeKey]
                .sort((a, b) => a.section.localeCompare(b.section))
                .map((c) => {
                  const { boys, girls } = getEnrollmentTotals(c.enrollment);

                  return (
                    <Link
                      key={c.id}
                      href={{
                        pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}`,
                        query: { id: c.id },
                      }}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {c.section.toUpperCase()}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Grade {gradeKey}
                          </p>
                        </div>

                        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                          <FiArrowRight />
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Boys</p>

                          <h4 className="mt-1 text-xl font-bold text-blue-700">
                            {boys}
                          </h4>
                        </div>

                        <div className="rounded-xl bg-pink-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Girls</p>

                          <h4 className="mt-1 text-xl font-bold text-pink-700">
                            {girls}
                          </h4>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Total</p>

                          <h4 className="mt-1 text-xl font-bold text-emerald-700">
                            {boys + girls}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        );
      })}

      {/* Empty */}
      {classes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <FiBookOpen size={32} />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-700">
            No Classes Yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Class records will appear here once added.
          </p>
        </div>
      )}
    </div>
  );
}
