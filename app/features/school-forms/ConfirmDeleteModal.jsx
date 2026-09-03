"use client";

export default function ConfirmDeleteModal({
  open,
  loading,
  title = "Delete this submission?",
  description = "This action cannot be undone. The file and its record will be permanently removed.",
  onCancel,
  onConfirm,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-lis-panel-border bg-white ">
        {error && (
          <div
            title={error}
            className="mx-5 mt-5 rounded-md bg-lis-danger-bg px-3 py-2 text-sm text-lis-danger-text truncate"
          >
            {error}
          </div>
        )}
        <div className="border-b border-lis-panel-border px-5 py-4">
          <h2 className="text-sm font-semibold text-lis-text">{title}</h2>
          <p className="mt-1.5 text-sm text-lis-muted">{description}</p>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4">
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
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
