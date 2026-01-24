"use client";

import { useState, useEffect } from "react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  error,
  description,
}) {
  const [password, setPassword] = useState("");

  // Reset input when modal closes
  useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Confirm Delete
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          {description ??
            "This action is permanent. Enter the delete password to continue."}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Delete password"
          className="border rounded px-3 py-2 w-full mb-2"
        />

        {/* Error message */}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(password)}
            disabled={loading || !password}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
