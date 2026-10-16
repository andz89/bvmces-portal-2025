"use client";

import { useState, useTransition } from "react";

import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

import { toast } from "react-hot-toast";

import { lockLessonPlanWeek, unlockLessonPlanWeek } from "./lessonPlanLockActions";

const selectClass =
  "w-full rounded-sm border border-lis-panel-border bg-white px-4 py-3 text-sm text-lis-text outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary";

export default function LessonPlanLocks({ locks, schoolYears }) {
  const activeYear =
    schoolYears.find((sy) => sy.status === "active")?.year_label ||
    schoolYears[0]?.year_label ||
    "";

  const [schoolYear, setSchoolYear] = useState(activeYear);
  const [term, setTerm] = useState("1");
  const [week, setWeek] = useState("1");
  const [unlockingId, setUnlockingId] = useState(null);

  const [isPending, startTransition] = useTransition();

  const handleLock = () => {
    startTransition(async () => {
      const res = await lockLessonPlanWeek({
        school_year: schoolYear,
        term,
        week,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Locked Term ${term} Week ${week} (${schoolYear})`);
    });
  };

  const handleUnlock = (lock) => {
    setUnlockingId(lock.id);
    startTransition(async () => {
      const res = await unlockLessonPlanWeek(lock.id);

      setUnlockingId(null);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(
        `Unlocked Term ${lock.term} Week ${lock.week} (${lock.school_year})`,
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-sm border border-lis-panel-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 px-6 md:px-8 py-7 border-b border-lis-panel-border bg-lis-panel-header/70">
        <div className="h-16 w-16 rounded-sm bg-lis-primary text-white flex items-center justify-center shrink-0">
          <BiLockAlt size={30} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-lis-text">
            Lesson Plan Upload Locks
          </h2>

          <p className="text-sm text-lis-muted mt-2">
            Lock a term and week so teachers can no longer upload lesson plans
            for it. A lock applies even during the Friday–Monday window.
          </p>
        </div>
      </div>

      {/* Lock form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 md:px-8 py-6 border-b border-lis-panel-border items-end">
        <div>
          <label className="block text-sm font-medium text-lis-text mb-2">
            School Year
          </label>
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            disabled={isPending}
            className={selectClass}
          >
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
            disabled={isPending}
            className={selectClass}
          >
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
            disabled={isPending}
            className={selectClass}
          >
            {Array.from({ length: 15 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLock}
          disabled={isPending || !schoolYear}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-lis-danger-bg px-4 py-3 text-sm font-semibold text-lis-danger-text transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <BiLockAlt size={18} />
          {isPending && !unlockingId ? "Locking..." : "Lock"}
        </button>
      </div>

      {/* Current locks */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-lis-panel-header border-b border-lis-panel-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                School Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Term
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Week
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Locked On
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-lis-muted">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {locks.length > 0 ? (
              locks.map((lock) => (
                <tr
                  key={lock.id}
                  className="border-b border-lis-panel-border transition hover:bg-lis-panel-header/70"
                >
                  <td className="px-6 py-4 font-semibold text-lis-text">
                    {lock.school_year}
                  </td>
                  <td className="px-6 py-4 text-sm text-lis-text">
                    Term {lock.term}
                  </td>
                  <td className="px-6 py-4 text-sm text-lis-text">
                    Week {lock.week}
                  </td>
                  <td className="px-6 py-4 text-sm text-lis-muted">
                    {new Date(lock.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUnlock(lock)}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-sm border border-lis-panel-border bg-white px-4 py-2 text-sm font-medium text-lis-success-text transition hover:bg-lis-panel-header disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <BiLockOpenAlt size={18} />
                        {unlockingId === lock.id ? "Unlocking..." : "Unlock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-lis-muted">
                  No locked weeks. Teachers can upload for any week during the
                  submission window.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
