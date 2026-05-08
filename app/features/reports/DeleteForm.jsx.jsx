"use client";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { deleteReport } from "./actions";
import FullPageLoader from "../../components/loader/FullPageLoader";
import { BiSolidTrash } from "react-icons/bi";

export default function DeleteForm({ reportId, onCancel }) {
  const [state, formAction, pending] = useActionState(deleteReport, null);
  const pathname = usePathname();
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Confirm Delete
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Enter your password to permanently delete this report.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={reportId} />
          <input type="hidden" name="pathname" defaultValue={pathname} />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Error */}
          {state?.error && (
            <div className="rounded-lg bg-red-100 text-red-700 px-3 py-2 text-sm">
              {state.error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {pending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>

        {pending && <FullPageLoader message="Deleting..." />}
      </div>
    </div>
  );
}
