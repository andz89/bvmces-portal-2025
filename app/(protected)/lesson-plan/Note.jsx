"use client";
import React, { useEffect, useState } from "react";
import { BiNote, BiPlus, BiX } from "react-icons/bi";
import { updateLessonPlanNote } from "./actions";
import { LESSON_PLAN_NOTE_MAX_LENGTH } from "./noteConfig";

const Note = ({ plan, profile, setUpdateLessonPlan }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = profile?.role === "admin";
  const note = String(plan.note ?? "").trim();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, saving]);

  const openModal = () => {
    setDraft(note);
    setError("");
    setOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const nextNote = draft.trim();

      await updateLessonPlanNote(plan.file_id, nextNote);

      setUpdateLessonPlan((prev) =>
        prev.map((item) =>
          item.file_id === plan.file_id ? { ...item, note: nextNote } : item,
        ),
      );

      setOpen(false);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {note ? (
        <button
          onClick={openModal}
          title="View note"
          className="flex max-w-40 cursor-pointer items-center gap-1 rounded-lg bg-lis-panel-header px-3 py-2 text-left text-xs text-lis-text hover:underline"
        >
          <BiNote className="shrink-0 text-lis-success-text" />
          <span className="truncate">{note}</span>
        </button>
      ) : isAdmin ? (
        <button
          onClick={openModal}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-lis-panel-border px-3 py-2 text-xs text-lis-muted hover:text-lis-success-text"
        >
          <BiPlus />
          Add note
        </button>
      ) : (
        <span className="text-xs text-lis-muted">—</span>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-sm bg-white"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-lis-panel-border px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-lis-text">Note</h2>
                <p className="mt-1 text-xs uppercase text-lis-muted">
                  {plan.teacherName} · {plan.subject} · Term {plan.term} / W -{" "}
                  {plan.week}
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
                className="cursor-pointer text-xl text-lis-muted hover:text-lis-text disabled:opacity-50"
              >
                <BiX />
              </button>
            </div>

            <div className="px-6 py-4">
              {error && (
                <div
                  title={error}
                  className="mb-3 truncate rounded-lg bg-lis-danger-bg px-3 py-2 text-sm text-lis-danger-text"
                >
                  {error}
                </div>
              )}

              {isAdmin ? (
                <>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={LESSON_PLAN_NOTE_MAX_LENGTH}
                    rows={6}
                    autoFocus
                    disabled={saving}
                    placeholder="Write a note for the teacher..."
                    className="w-full resize-y rounded-lg border border-lis-panel-border p-3 text-sm text-lis-text focus:outline-none disabled:opacity-50"
                  />
                  <p className="mt-1 text-right text-xs text-lis-muted">
                    {draft.length}/{LESSON_PLAN_NOTE_MAX_LENGTH}
                  </p>
                </>
              ) : (
                <p className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words text-sm text-lis-text">
                  {note}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 pb-4">
              <button
                disabled={saving}
                onClick={closeModal}
                className="rounded-lg border border-lis-panel-border px-4 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-panel-header disabled:opacity-50"
              >
                {isAdmin ? "Cancel" : "Close"}
              </button>

              {isAdmin && (
                <button
                  disabled={saving || draft.trim() === note}
                  onClick={handleSave}
                  className="rounded-lg bg-lis-success px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
