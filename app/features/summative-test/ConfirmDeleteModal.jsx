"use client";

export default function ConfirmDeleteModal({
  open,
  loading,
  title = "Delete Submission?",
  description = "This action cannot be undone. The submission and its uploaded files will be permanently deleted.",
  onCancel,
  onConfirm,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl">
        {error && (
          <div
            title={error}
            className="mx-5 mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 truncate"
          >
            {error}
          </div>
        )}
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="mt-1.5 text-sm text-gray-500">{description}</p>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4">
          <button
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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
