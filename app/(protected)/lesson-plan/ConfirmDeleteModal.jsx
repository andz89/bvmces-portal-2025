"use client";

import React from "react";

export default function ConfirmDeleteModal({
  open,
  loading,
  title = "Delete Lesson Plan?",
  description = "This action cannot be undone. The lesson plan and uploaded file will be permanently deleted.",
  onCancel,
  onConfirm,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-sm bg-white ">
        {/* Header */}
        {error && (
          <div
            title={error}
            className="mb-3 rounded-lg bg-lis-danger-bg px-3 py-2 text-sm text-lis-danger-text truncate"
          >
            {error}
          </div>
        )}
        <div className="border-b border-lis-panel-border px-6 py-5">
          <h2 className="text-lg font-semibold text-lis-text">{title}</h2>

          <p className="mt-2 text-sm text-lis-muted">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-lis-panel-border px-4 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-panel-header disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-lis-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-lis-danger-hover disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
