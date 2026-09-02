"use client";
import { getLessonPlans } from "./actions";
import DataEntryForm from "./DataEntryForm";
import React, { useState, useEffect } from "react";
import {
  BiBook,
  BiCalendar,
  BiLinkExternal,
  BiUser,
  BiTrash,
} from "react-icons/bi";
import { deleteLessonPlan, updateLessonPlanStatus } from "./actions";
import SearchBar from "./SearchBar";
import Status from "./status";
import Link from "next/link";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
export default function LessonPlanAdmin({
  lessonPlans,
  users,
  profile,
  weekParams,
  termParams,
  canSubmit,
}) {
  const [updatedLessonPlan, setUpdateLessonPlan] = useState(lessonPlans);
  const [showAll, setShowAll] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  useEffect(() => {
    setUpdateLessonPlan(lessonPlans);
  }, [lessonPlans]);
  // Get all user IDs that already have a lesson plan
  const lessonPlanUserIds = new Set(
    updatedLessonPlan.map((plan) => plan.teacher_id),
  );

  // Users without a lesson plan
  const usersWithoutLessonPlan = users.filter(
    (user) => !lessonPlanUserIds.has(user.id),
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const result = await deleteLessonPlan(deleteId);

      if (!result?.success && result?.status !== "success") {
        throw new Error(result?.message || "Unable to delete lesson plan.");
      }

      setUpdateLessonPlan((prev) =>
        prev.filter((plan) => plan.file_id !== deleteId),
      );

      setDeleteId(null);
    } catch (err) {
      console.error(err);

      setDeleteError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the lesson plan.",
      );
    } finally {
      setDeleting(false);
    }
  };
  const displayedUsers = showAll
    ? usersWithoutLessonPlan
    : usersWithoutLessonPlan.slice(0, 5);
  const groupedLessonPlans = [...updatedLessonPlan]
    .sort((a, b) => {
      // Sort by term
      if (Number(a.term) !== Number(b.term)) {
        return Number(a.term) - Number(b.term);
      }

      // Sort by grade
      const gradeOrder = {
        Kindergarten: 0,
        "Grade 1": 1,
        "Grade 2": 2,
        "Grade 3": 3,
        "Grade 4": 4,
        "Grade 5": 5,
        "Grade 6": 6,
      };

      if (gradeOrder[a.grade] !== gradeOrder[b.grade]) {
        return gradeOrder[a.grade] - gradeOrder[b.grade];
      }

      // Sort by week
      return Number(a.week) - Number(b.week);
    })
    .reduce((groups, plan) => {
      if (!groups[plan.term]) {
        groups[plan.term] = {};
      }

      if (!groups[plan.term][plan.grade]) {
        groups[plan.term][plan.grade] = [];
      }

      groups[plan.term][plan.grade].push(plan);

      return groups;
    }, {});

  return (
    <div className="rounded-sm border border-lis-panel-border bg-white  overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-lis-panel-border bg-lis-panel-header">
        <div>
          <h2 className="text-2xl font-semibold text-lis-text  ">
            Lesson Plans
          </h2>
        </div>
        <DataEntryForm
          profile={profile}
          setUpdateLessonPlan={setUpdateLessonPlan}
          canSubmit={canSubmit}
        />
      </div>
      <SearchBar weekParams={weekParams} termParams={termParams} />

      {(profile.role === "admin" || profile.role === "visitor") && (
        <div className="px-6 py-3  ">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-semibold text-lis-text">
              Teachers Without Lesson Plan
            </h3>

            <span className="rounded-full bg-lis-danger-bg px-2 py-0.5 text-xs font-medium text-lis-danger-text">
              {usersWithoutLessonPlan.length}
            </span>
          </div>

          {usersWithoutLessonPlan.length === 0 ? (
            <p className="text-sm text-lis-success-text">
              All teachers have submitted their lesson plans.
            </p>
          ) : (
            <div>
              <div>
                {displayedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex gap-2 rounded-md px-2 py-1 hover:bg-lis-panel-header"
                  >
                    <span className="text-sm font-medium uppercase text-lis-text">
                      {user.full_name} -
                    </span>

                    <span className="text-sm font-semibold uppercase text-lis-muted">
                      {user.grade === "implementation" ||
                      user.grade === "kindergarten"
                        ? ""
                        : "Grade"}{" "}
                      {user.grade}
                    </span>
                  </div>
                ))}

                {usersWithoutLessonPlan.length > 5 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-2 px-2 text-sm font-medium text-lis-success-text hover:text-lis-success-text hover:underline"
                  >
                    {showAll
                      ? "See less"
                      : `See ${usersWithoutLessonPlan.length - 5} more`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {updatedLessonPlan.length === 0 ? (
        <div className="py-16 text-center">
          <BiBook className="mx-auto text-5xl text-lis-muted" />

          <h3 className="mt-4 text-lg font-semibold text-lis-text">
            No lesson plans found
          </h3>

          <p className="mt-1 text-sm text-lis-muted">
            Upload your first lesson plan.
          </p>
        </div>
      ) : (
        <div>
          {Object.entries(groupedLessonPlans).map(([term, grades]) => (
            <div key={term} className="mb-10">
              {/* TERM */}
              <div className="flex items-center justify-between bg-lis-success p-1">
                <div className="text-white px-6   text-lg font-bold">
                  Term {term} / Week {weekParams}
                </div>
                <div className="rounded-lg border border-lis-panel-border bg-white px-4 py-2 flex items-center gap-2">
                  <p className="text-xs uppercase tracking-wide text-lis-muted">
                    Total
                  </p>

                  <p className="text-sm font-bold text-lis-text">
                    {lessonPlans.length}
                  </p>
                </div>
              </div>

              {Object.entries(grades).map(([grade, plans]) => {
                const canDelete = plans.some(
                  (plan) => plan.teacher_id === profile.id,
                );

                return (
                  <div key={grade}>
                    {/* GRADE */}
                    <div className="flex justify-between items-center bg-lis-panel-header border-l-4 z-100 border-lis-panel-border px-6 py-3 font-semibold text-lis-success-text uppercase text-sm">
                      <div>
                        {grade === "implementation" || grade === "kindergarten"
                          ? ""
                          : "Grade"}{" "}
                        {grade} / Term {term} / Week {weekParams}
                      </div>

                      <span className="rounded-full bg-lis-panel-header px-2 py-0.5 text-xs font-bold text-lis-text">
                        {plans.length}
                      </span>
                    </div>
                    <div className="overflow-x-auto z-100">
                      {" "}
                      <table className="w-full  overflow-auto ">
                        <thead className="border-b">
                          <tr className="text-left  text-lis-text text-sm">
                            <th className="px-6 py-3 w-40">Teacher</th>
                            <th className="px-6 py-3 w-40">Grade</th>
                            <th className="px-6 py-3">Week</th>
                            <th className="px-6 py-3">Term</th>
                            <th className="px-6 py-3 text-center">Subject</th>

                            <th className="px-6 py-3 text-center">Submitted</th>
                            <th className="px-6 py-3 text-center">
                              Lesson Plan
                            </th>
                            <th className="px-6 py-3  ">Status</th>

                            {canDelete && (
                              <th className="px-6 py-3 text-center">--</th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {plans.map((plan) => (
                            <tr
                              key={plan.file_id}
                              className="border-b border-lis-panel-border hover:bg-lis-panel-header transition "
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 ">
                                  <div className="h-10 w-10 rounded-full bg-lis-panel-header flex items-center justify-center">
                                    <BiUser className="text-lis-success-text text-lg" />
                                  </div>

                                  <Link
                                    className="font-medium text-lis-text uppercase text-sm w-40"
                                    href={{
                                      pathname: `/lesson-plan/teacher`,
                                      query: {
                                        id: plan.teacher_id,
                                        term: 1,
                                      },
                                    }}
                                    target="_blank"
                                  >
                                    {plan.teacherName}
                                  </Link>
                                </div>
                              </td>
                              <td className="px-6 py-4 uppercase text-sm w-40">
                                {plan.lesson_level}
                              </td>
                              <td className="px-6 py-4  ">
                                <span className="inline-flex w-15 items-center gap-1 rounded-full   py-1 text-sm font-medium text-lis-success-text">
                                  W - {plan.week}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 rounded-full bg-lis-panel-header px-3 py-1 text-sm font-medium text-lis-success-text uppercase">
                                  {plan.term}
                                </span>
                              </td>
                              <td className="  py-4 w-full     text-center">
                                <span className="items-center gap-1 rounded-full    font-medium text-lis-success-text text-xs uppercase ">
                                  {plan.subject}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 rounded-full bg-lis-panel-header px-3 py-1 text-sm font-medium text-lis-success-text">
                                  {(() => {
                                    const formatted = new Date(
                                      plan.Timestamp,
                                    ).toLocaleDateString("en-US");
                                    return formatted;
                                  })()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <a
                                  href={plan.FileLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg border border-lis-panel-border bg-lis-panel-header px-4 py-2 text-sm font-medium text-lis-success-text transition hover:bg-lis-panel-header"
                                >
                                  <BiLinkExternal />
                                  Open
                                </a>
                              </td>
                              <td className="px-6 py-4">
                                <Status
                                  plan={plan}
                                  profile={profile}
                                  setUpdateLessonPlan={setUpdateLessonPlan}
                                />
                              </td>
                              <td className="px-6 py-4  ">
                                <button
                                  disabled={profile.id !== plan.teacher_id}
                                  onClick={() => setDeleteId(plan.file_id)}
                                  className={`inline-flex items-center gap-2 rounded-lg     px-4 py-2 text-sm font-medium  transition  ${profile.id !== plan.teacher_id ? "bg-lis-panel-header text-lis-muted cursor-not-allowed" : "hover:bg-lis-danger-bg   bg-lis-danger-bg text-lis-danger-text"}`}
                                >
                                  <BiTrash size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      <ConfirmDeleteModal
        open={!!deleteId}
        loading={deleting}
        error={deleteError}
        onCancel={() => {
          if (deleting) return;

          setDeleteError("");
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
