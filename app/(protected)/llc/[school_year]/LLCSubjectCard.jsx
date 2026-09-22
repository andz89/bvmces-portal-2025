"use client";

import { useEffect, useState } from "react";
import { BiSave, BiSolidTrash } from "react-icons/bi";
import toast from "react-hot-toast";

import { saveLLC, deleteLLC } from "../../../features/llc/actions";
import { gradeLabel } from "../../../features/llc/constants";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

const LLCSubjectCard = ({
  subject,
  grade,
  term,
  school_year,
  record,
  canEdit,
  isAdmin,
  cardKey,
  onDirtyChange,
}) => {
  const [content, setContent] = useState(record?.content || "");
  const [savedContent, setSavedContent] = useState(record?.content || "");
  const [saving, setSaving] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isDirty = content !== savedContent;

  // Report this card's dirty status up to the page so it can warn before
  // the tab is closed/reloaded with unsaved changes anywhere on the page.
  useEffect(() => {
    onDirtyChange?.(cardKey, isDirty);

    return () => onDirtyChange?.(cardKey, false);
  }, [isDirty, cardKey, onDirtyChange]);

  const showStatus = canEdit && (content || savedContent);

  const handleSave = async () => {
    setSaving(true);

    try {
      const result = await saveLLC({ grade, subject, term, school_year, content });

      if (result.success) {
        setSavedContent(content);
        toast.success("LLC entry saved.");
      } else {
        toast.error(result.error || "Failed to save LLC entry.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (password) => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const result = await deleteLLC({ grade, subject, term, school_year, password });

      if (result.success) {
        setOpenDelete(false);
        setContent("");
        setSavedContent("");
        toast.success(result.message);
      } else if (result.message === "invalid_password") {
        setDeleteError("Invalid password. Please try again.");
      } else {
        setDeleteError(result.message || "Failed to delete LLC entry.");
      }
    } catch (err) {
      setDeleteError("Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-sm
        border
        border-lis-panel-border
        p-5
      "
    >
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        error={deleteError}
        description={`Delete the LLC entry for ${gradeLabel(grade)} ${subject.toUpperCase()}? This action cannot be undone.`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-lis-text tracking-wide">
          <span className="normal-case">{gradeLabel(grade)}</span>
          <span className="text-lis-muted font-medium"> · </span>
          <span className="uppercase">{subject.replace("/", " / ")}</span>
        </h3>

        {isAdmin && record && (
          <button
            onClick={() => setOpenDelete(true)}
            className="text-lis-danger-text hover:opacity-70 transition"
            title="Delete entry"
          >
            <BiSolidTrash size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        readOnly={!canEdit}
        rows={4}
        placeholder={
          canEdit
            ? "Write the least learned competency for this subject..."
            : "No LLC written yet."
        }
        className={`
          w-full
          rounded-sm
          border
          border-lis-panel-border
          px-3
          py-2
          text-sm
          text-lis-text
          outline-none
          transition
          resize-none
          ${canEdit ? "bg-white focus:border-lis-primary focus:ring-4 focus:ring-lis-primary" : "bg-lis-panel-header text-lis-muted"}
        `}
      />

      {/* Footer */}
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-lis-muted truncate">
            {record?.owner?.full_name
              ? `Last edited by ${record.owner.full_name}`
              : canEdit
                ? ""
                : "Not yet written"}
          </p>

          {showStatus && (
            <p
              className={`text-[11px] font-semibold ${
                saving
                  ? "text-lis-muted"
                  : isDirty
                    ? "text-lis-warning-text"
                    : "text-lis-success-text"
              }`}
            >
              {saving
                ? "Saving..."
                : isDirty
                  ? "Unsaved changes"
                  : "All changes saved"}
            </p>
          )}
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-sm
              bg-lis-primary
              px-3
              py-1.5
              text-xs
              font-semibold
              text-white
              transition
              hover:scale-[1.02]
              disabled:opacity-40
              disabled:hover:scale-100
            "
          >
            <BiSave size={14} />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LLCSubjectCard;
