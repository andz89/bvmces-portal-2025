"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BiTargetLock, BiFilterAlt } from "react-icons/bi";

import { SUBJECTS, GRADES, TERMS, gradeLabel } from "../../../features/llc/constants";
import LLCSubjectCard from "./LLCSubjectCard";

function canEditGrade(editableGrades, grade) {
  if (editableGrades === null) return true; // admin
  if (!editableGrades) return false;
  return editableGrades.includes(String(grade));
}

const LLCClient = ({ profile, llc, editableGrades, school_year }) => {
  const [activeTerm, setActiveTerm] = useState("1");

  const [filterGrade, setFilterGrade] = useState("all");

  const isAdmin = profile?.role === "admin";

  // Fast lookup: `${term}|${grade}|${subject}` -> record
  const recordsByKey = new Map(
    llc.map((item) => [`${item.term}|${item.grade}|${item.subject}`, item]),
  );

  const countForTerm = (term) =>
    llc.filter((item) => String(item.term) === term).length;

  // Tracks every currently-mounted card that has unsaved edits, so we can
  // warn before the tab is closed/reloaded. A ref (not state) because we
  // only ever need the live value at unload time, not a re-render.
  const dirtyCardsRef = useRef(new Set());

  const handleDirtyChange = useCallback((cardKey, isDirty) => {
    if (isDirty) {
      dirtyCardsRef.current.add(cardKey);
    } else {
      dirtyCardsRef.current.delete(cardKey);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirtyCardsRef.current.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-lis-bg pb-20 w-full">
      {/* Hero */}
      <div className="relative overflow-hidden bg-lis-primary w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lis-panel-header/10 rounded-full"></div>

        <div className="relative mx-auto px-4 md:px-10 py-10">
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
            <BiTargetLock size={16} />
            Least Learned Competencies
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            LLC Dashboard
          </h1>

          <p className="text-white/80 text-base mt-3 max-w-2xl">
            Write and review the least learned competency for each subject,
            by grade level and term.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/10 border border-white/10 rounded-sm px-5 py-4 min-w-[170px]">
              <p className="text-xs uppercase tracking-wide text-white/80">
                School Year
              </p>

              <h3 className="text-xl font-bold text-white mt-1">
                {school_year}
              </h3>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-sm px-5 py-4 min-w-[170px]">
              <p className="text-xs uppercase tracking-wide text-white/80">
                LLC Entries
              </p>

              <h3 className="text-2xl font-bold text-white mt-1">
                {llc.length}
              </h3>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-sm px-5 py-4 min-w-[170px]">
              <p className="text-xs uppercase tracking-wide text-white/80">
                Your Access
              </p>

              <h3 className="text-lg font-bold text-white mt-1">
                {isAdmin
                  ? "All Grades"
                  : editableGrades?.length
                    ? editableGrades.map(gradeLabel).join(", ")
                    : "View Only"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 md:px-10 py-8">
        {/* Term Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-lis-panel-border pb-1">
          {TERMS.map((term) => {
            const isActive = activeTerm === term;

            return (
              <button
                key={term}
                onClick={() => setActiveTerm(term)}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-t-2xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  border-b-2
                  ${
                    isActive
                      ? "border-lis-panel-border text-lis-link bg-lis-panel-header/60"
                      : "border-transparent text-lis-muted hover:text-lis-text hover:bg-lis-panel-header"
                  }
                `}
              >
                <span>Term {term}</span>

                <span
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    min-w-[22px]
                    h-[22px]
                    rounded-full
                    text-xs
                    font-bold
                    px-1.5
                    ${
                      isActive
                        ? "bg-lis-primary text-white"
                        : "bg-lis-panel-header text-lis-muted"
                    }
                  `}
                >
                  {countForTerm(term)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-sm border border-lis-panel-border bg-white p-4">
          <div className="flex items-center gap-2 text-lis-muted">
            <BiFilterAlt size={18} />
            <span className="text-sm font-medium">Filter</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-lis-text">Grade</label>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="rounded-sm border border-lis-panel-border bg-white px-3 py-2 text-sm text-lis-text outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary"
            >
              <option value="all">All Grades</option>
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {gradeLabel(grade)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade Sections */}
        <div className="space-y-10">
          {GRADES.map((grade) => {
            const gradeCanEdit = canEditGrade(editableGrades, grade);

            // Grades outside the current filter stay mounted (just
            // visually hidden) so unsaved edits in them aren't silently
            // discarded when the filter changes.
            const isHiddenByFilter =
              filterGrade !== "all" && filterGrade !== grade;

            return (
              <div key={grade} className={isHiddenByFilter ? "hidden" : ""}>
                {/* Grade Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-lis-text">
                    {gradeLabel(grade)}
                  </h2>

                  {!gradeCanEdit && (
                    <span className="text-xs font-medium text-lis-muted rounded-full bg-lis-panel-header px-3 py-1">
                      View only
                    </span>
                  )}
                </div>

                {/* Subject Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {SUBJECTS.map((subject) => {
                    const record = recordsByKey.get(
                      `${activeTerm}|${grade}|${subject}`,
                    );

                    return (
                      <LLCSubjectCard
                        key={`${activeTerm}-${subject}`}
                        subject={subject}
                        grade={grade}
                        term={activeTerm}
                        school_year={school_year}
                        record={record}
                        canEdit={gradeCanEdit}
                        isAdmin={isAdmin}
                        cardKey={`${activeTerm}|${grade}|${subject}`}
                        onDirtyChange={handleDirtyChange}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LLCClient;
