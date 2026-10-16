"use client";

import { useState } from "react";

import { BiHistory, BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

const selectClass =
  "w-full rounded-sm border border-lis-panel-border bg-white px-4 py-3 text-sm text-lis-text outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary";

export default function LessonPlanLockHistory({ history, schoolYears }) {
  const [schoolYear, setSchoolYear] = useState("");
  const [term, setTerm] = useState("");
  const [week, setWeek] = useState("");

  const filtered = history.filter(
    (row) =>
      (!schoolYear || row.school_year === schoolYear) &&
      (!term || Number(row.term) === Number(term)) &&
      (!week || Number(row.week) === Number(week)),
  );

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-sm border border-lis-panel-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 px-6 md:px-8 py-7 border-b border-lis-panel-border bg-lis-panel-header/70">
        <div className="h-16 w-16 rounded-sm bg-lis-primary text-white flex items-center justify-center shrink-0">
          <BiHistory size={30} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-lis-text">
            Lock History
          </h2>

          <p className="text-sm text-lis-muted mt-2">
            Every lock and unlock, with who did it and when.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 md:px-8 py-6 border-b border-lis-panel-border">
        <div>
          <label className="block text-sm font-medium text-lis-text mb-2">
            School Year
          </label>
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className={selectClass}
          >
            <option value="">All school years</option>
            {schoolYears.map((sy) => (
              <option key={sy.id} value={sy.year_label}>
                {sy.year_label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-lis-text mb-2">
            Term
          </label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className={selectClass}
          >
            <option value="">All terms</option>
            {Array.from({ length: 3 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Term {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-lis-text mb-2">
            Week
          </label>
          <select
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className={selectClass}
          >
            <option value="">All weeks</option>
            {Array.from({ length: 15 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-lis-panel-header border-b border-lis-panel-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                When
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Term / Week
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                School Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                By
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-lis-panel-border transition hover:bg-lis-panel-header/70"
                >
                  <td className="px-6 py-4 text-sm text-lis-muted whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("en-US", {
                      timeZone: "Asia/Manila",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {row.action === "locked" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lis-danger-bg px-3 py-1 text-xs font-semibold text-lis-danger-text">
                        <BiLockAlt /> Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-lis-panel-border bg-lis-panel-header px-3 py-1 text-xs font-semibold text-lis-success-text">
                        <BiLockOpenAlt /> Unlocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-lis-text">
                    Term {row.term} / Week {row.week}
                  </td>
                  <td className="px-6 py-4 text-sm text-lis-text">
                    {row.school_year}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium uppercase text-lis-text">
                    {row.actor_name || "Unknown"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-lis-muted">
                  No lock history{schoolYear || term || week ? " for this filter" : " yet"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
