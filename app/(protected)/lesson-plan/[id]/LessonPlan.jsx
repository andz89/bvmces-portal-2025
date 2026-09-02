"use client";
import { getLessonPlans, deleteLessonPlan } from "../actions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import {
  BiBook,
  BiCalendar,
  BiLinkExternal,
  BiUser,
  BiTrash,
} from "react-icons/bi";
import Status from "../status";
import DataEntryForm from "../DataEntryForm";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

export default function LessonPlanAdmin({
  lessonPlans,
  profile,
  termParams,
  teacher_id,
  upload_lesson_plan,
  canSubmit,
}) {
  const [updatedLessonPlan, setUpdateLessonPlan] = useState(lessonPlans);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(termParams ?? 1);
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteLessonPlan(deleteId);

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
  useEffect(() => {
    setTerm(termParams ?? 1);
  }, [termParams]);
  const handleTermChange = (e) => {
    const value = e.target.value;

    setTerm(value);

    const params = new URLSearchParams(searchParams.toString());

    params.set("term", value);
    startTransition(() => {
      router.push(`/lesson-plan/teacher?${params.toString()}`);
    });
  };

  useEffect(() => {
    setUpdateLessonPlan(lessonPlans);
  }, [lessonPlans]);

  const sortedLessonPlans = [...updatedLessonPlan].sort((a, b) => {
    const gradeOrder = {
      Kindergarten: 0,
      "Grade 1": 1,
      "Grade 2": 2,
      "Grade 3": 3,
      "Grade 4": 4,
      "Grade 5": 5,
      "Grade 6": 6,
    };

    // Sort by grade
    if (gradeOrder[a.grade] !== gradeOrder[b.grade]) {
      return gradeOrder[a.grade] - gradeOrder[b.grade];
    }

    // Then by week
    return Number(a.week) - Number(b.week);
  });

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
          upload_lesson_plan={upload_lesson_plan}
          canSubmit={canSubmit}
        />
      </div>
      <div className="border-b border-lis-panel-border bg-white px-6 py-4">
        <div className="max-w-100 gap-2 flex items-center">
          <select
            value={term}
            disabled={isPending}
            onChange={handleTermChange}
            className={` w-50 rounded-sm border px-4 py-2.5 outline-none transition
    ${
      isPending
        ? "cursor-not-allowed bg-lis-panel-header text-lis-muted"
        : "border-lis-panel-border focus:border-lis-primary"
    }`}
          >
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
          {isPending && (
            <p className="mt-2 text-sm text-lis-muted">
              Loading lesson plans...
            </p>
          )}
        </div>
      </div>
      <div className="mb-10">
        <div className="flex items-center justify-between bg-lis-success p-1">
          <div className="px-6 text-lg font-bold text-white">
            Term {termParams}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-lis-panel-border bg-white px-4 py-2">
            <p className="text-xs uppercase tracking-wide text-lis-muted">
              Total
            </p>

            <p className="text-sm font-bold text-lis-text">
              {sortedLessonPlans.length}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full  z-54 ">
            <thead className="border-b">
              <tr className="text-left text-lis-text text-sm ">
                <th className="px-6 py-3 w-40">Teacher</th>
                <th className="px-6 py-3 w-40">Grade</th>
                <th className="px-6 py-3">Week</th>

                <th className="px-6 py-3">Term</th>
                <th className="px-6 py-3 text-center">Subject</th>

                <th className="px-6 py-3 text-center">Submitted </th>
                <th className="px-6 py-3 text-center">Lesson Plan</th>
                <th className="px-6 py-3  ">Status</th>

                {/* {canDelete && <th className="px-6 py-3 text-center">--</th>} */}
              </tr>
            </thead>

            <tbody>
              {sortedLessonPlans.map((plan) => (
                <tr
                  key={plan.file_id}
                  className="border-b border-lis-panel-border hover:bg-lis-panel-header transition text-xs"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 ">
                      <div className="h-10 w-10 rounded-full bg-lis-panel-header flex items-center justify-center">
                        <BiUser className="text-lis-success-text text-lg" />
                      </div>

                      <span className="font-medium text-lis-text uppercase text-sm w-40">
                        {plan.teacherName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 uppercase text-sm w-40">
                    {plan.lesson_level}
                  </td>

                  <td className="px-6 py-4 ">
                    <span className="inline-flex w-15 items-center gap-1 rounded-full   py-1 text-sm font-medium text-lis-success-text">
                      W - {plan.week}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-lis-panel-header px-3 py-1 text-sm font-medium text-lis-success-text">
                      {plan.term}
                    </span>
                  </td>
                  <td className="  py-4 w-full     text-center">
                    <span className="items-center gap-1 rounded-full uppercase text-xs font-medium text-lis-success-text ">
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
                  {profile.id === plan.teacher_id && (
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setDeleteId(plan.file_id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-lis-danger-border bg-lis-danger-bg px-4 py-2 text-sm font-medium text-lis-danger-text transition hover:bg-lis-danger-bg"
                      >
                        <BiTrash size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
