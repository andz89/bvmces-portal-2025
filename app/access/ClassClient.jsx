"use client";

import FullPageLoader from "@/app/components/loader/FullPageLoader";
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
      <div className="overflow-hidden rounded-sm border border-lis-panel-border bg-white">
        <div className="p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-sm bg-lis-panel-header px-3 py-1 text-sm text-lis-muted border border-lis-panel-border">
            <FiUsers />
            Enrollment Overview
          </div>

          <h2 className="mt-5 text-2xl font-normal text-lis-heading">
            Enrollment Summary
          </h2>

          <p className="mt-2 text-sm text-lis-muted">
            Grade K–6{" "}
            {year_status === "active" ? `• As of ${formatToday()}` : ""}
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-lis-panel-border bg-lis-panel-header p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lis-muted">Boys</p>

                  <h3 className="mt-2 text-3xl font-bold text-lis-text">
                    {overallTotals.boys}
                  </h3>
                </div>

                <FiUser size={24} className="text-lis-muted" />
              </div>
            </div>

            <div className="rounded-sm border border-lis-panel-border bg-lis-panel-header p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lis-muted">Girls</p>

                  <h3 className="mt-2 text-3xl font-bold text-lis-text">
                    {overallTotals.girls}
                  </h3>
                </div>

                <FiUser size={24} className="text-lis-muted" />
              </div>
            </div>

            <div className="rounded-sm border border-lis-success bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lis-muted">Total</p>

                  <h3 className="mt-2 text-3xl font-bold text-lis-success-text">
                    {overallTotals.boys + overallTotals.girls}
                  </h3>
                </div>

                <FiUsers size={24} className="text-lis-success" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-auto rounded-sm border border-lis-panel-border bg-white my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-lis-panel-header text-lis-text">
              <th className="border border-lis-panel-border px-4 py-3 text-left">
                Enrollment
              </th>

              {["K", "G1", "G2", "G3", "G4", "G5", "G6"].map((grade) => (
                <th
                  key={grade}
                  className="border border-lis-panel-border px-4 py-3 text-center"
                >
                  {grade}
                </th>
              ))}

              <th className="border border-lis-panel-border px-4 py-3 text-center">
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
                  <td className="border border-lis-panel-border px-4 py-4 font-medium bg-lis-panel-header">
                    {rowLabel}
                  </td>

                  {["K", "1", "2", "3", "4", "5", "6"].map((grade) => {
                    const filtered = classes.filter((c) => {
                      if (grade === "K") return c.grade === "kindergarten";

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
                        className="border border-lis-panel-border px-4 py-3 text-center"
                      >
                        <div className="space-y-1">
                          <div>
                            <span className="text-lis-muted mr-1">M</span>
                            <span className="font-medium">{boys}</span>
                          </div>

                          <div>
                            <span className="text-lis-muted mr-1">F</span>
                            <span className="font-medium">{girls}</span>
                          </div>

                          <div>
                            <span className="text-lis-muted mr-1">T</span>
                            <span className="font-semibold text-lis-success-text">
                              {boys + girls}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  {/* Grand Total */}
                  <td className="border border-lis-panel-border px-4 py-3 text-center bg-lis-panel-header">
                    <div className="space-y-1">
                      <div>
                        <span className="text-lis-muted mr-1">M</span>
                        <span className="font-medium">{grandBoys}</span>
                      </div>

                      <div>
                        <span className="text-lis-muted mr-1">F</span>
                        <span className="font-medium">{grandGirls}</span>
                      </div>

                      <div>
                        <span className="text-lis-muted mr-1">T</span>
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
            className="overflow-hidden rounded-sm border border-lis-panel-border bg-white  my-3"
          >
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-lis-panel-border bg-lis-panel-header px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-lis-primary text-white">
                  <FiBookOpen size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-lis-heading">
                    Grade {gradeKey}
                  </h2>

                  <p className="text-sm text-lis-muted">
                    {classesByGrade[gradeKey].length} Sections
                  </p>
                </div>
              </div>

              <div className="rounded-sm border border-lis-success bg-white px-4 py-2 text-sm font-medium text-lis-muted">
                Total Students:{" "}
                <span className="font-bold text-lis-success-text">
                  {gradeTotals.boys + gradeTotals.girls}
                </span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse">
                <thead className="bg-lis-panel-header text-sm text-lis-text">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold w-full">
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
                          className="border-t border-lis-panel-border transition hover:bg-lis-panel-header "
                        >
                          <td className="px-6 py-4 flex flex-col w-full">
                            <Link
                              href={{
                                pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/enrollment`,
                                query: { id: c.id },
                              }}
                              className="inline-flex items-center gap-2 font-semibold text-lis-link hover:underline"
                            >
                              {c.section.toUpperCase()}

                              <FiArrowRight />
                            </Link>
                            <span className="text-xs uppercase tracking-wide text-lis-muted mt-1">
                              Adviser: {c.users?.full_name}{" "}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">{boys}</td>

                          <td className="px-6 py-4 text-center">{girls}</td>

                          <td className="px-6 py-4 text-center font-bold text-lis-success-text">
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
                        pathname: `/class/${year_label}/${c.grade}/${c.section.trim()}/enrollment`,
                        query: { id: c.id },
                      }}
                      className="block rounded-sm border border-lis-panel-border bg-lis-panel-header p-4 transition hover:bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-lis-text">
                            {c.section.toUpperCase()}
                          </h3>

                          <p className="mt-1 text-sm text-lis-muted">
                            Grade {gradeKey}
                          </p>
                        </div>

                        <div className="rounded-sm bg-lis-panel-header p-2 text-lis-link">
                          <FiArrowRight />
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-sm bg-lis-panel-header p-3 text-center">
                          <p className="text-xs text-lis-muted">Boys</p>

                          <h4 className="mt-1 text-xl font-bold text-lis-text">
                            {boys}
                          </h4>
                        </div>

                        <div className="rounded-sm bg-lis-panel-header p-3 text-center">
                          <p className="text-xs text-lis-muted">Girls</p>

                          <h4 className="mt-1 text-xl font-bold text-lis-text">
                            {girls}
                          </h4>
                        </div>

                        <div className="rounded-sm border border-lis-success bg-white p-3 text-center">
                          <p className="text-xs text-lis-muted">Total</p>

                          <h4 className="mt-1 text-xl font-bold text-lis-success-text">
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
        <div className="rounded-sm border border-dashed border-lis-panel-border bg-white py-16 text-center ">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm bg-lis-panel-header text-lis-muted">
            <FiBookOpen size={32} />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-lis-text">
            No Classes Yet
          </h3>

          <p className="mt-2 text-sm text-lis-muted">
            Class records will appear here once added.
          </p>
        </div>
      )}
    </div>
  );
}
