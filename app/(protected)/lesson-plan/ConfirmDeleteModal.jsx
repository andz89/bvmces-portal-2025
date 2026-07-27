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
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        {error && (
          <div
            title={error}
            className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 truncate"
          >
            {error}
          </div>
        )}
        <div className="border-b border-neutral-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>

          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
