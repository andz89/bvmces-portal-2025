"use client";

import { useState } from "react";
import { deleteReport } from "./actions";
import toast from "react-hot-toast";
import FullPageLoader from "../../components/loader/FullPageLoader";

export default function DeleteForm({ file_id, onCancel, refreshReports, type }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const result = await deleteReport(file_id, password, type);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Deleted successfully!");

      onCancel();

      await refreshReports();
    } catch (err) {
      console.error(err);

      toast.error("Unable to delete report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Confirm Delete
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your password to permanently delete this report.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {loading && <FullPageLoader message="Deleting..." />}
      </div>
    </div>
  );
}
