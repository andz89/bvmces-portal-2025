"use client";

import { useActionState } from "react";
import { createReport } from "./actions";
export default function ReportForm() {
  const [state, formAction, pending] = useActionState(createReport, null);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Submit Report
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the required details below
          </p>
        </div>
        {/* Feedback */}
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && (
          <p className="text-green-600 text-sm">
            Report submitted successfully!
          </p>
        )}
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Filename */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filename
            </label>
            <input
              type="text"
              name="filename"
              placeholder="Phil IRI"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Enter description..."
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500 resize-y"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Link
            </label>
            <input
              type="url"
              name="link"
              placeholder="https://example.com"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Report Type
            </label>
            <select
              name="type"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500"
              required
            >
              <option value="">Select type</option>
              <option value="crla">CRLA</option>
              <option value="phil-iri">PHIL-IRI</option>
              <option value="rma">RMA</option>
            </select>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Stage
            </label>
            <select
              name="stage"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500"
              required
            >
              <option value="">Select stage</option>
              <option value="pre">Pre Assessment</option>
              <option value="post">Post Assessment</option>
            </select>
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              School Year
            </label>
            <select
              name="school_year"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-none focus:ring-slate-500 focus:border-slate-500"
              required
            >
              <option value="">Select school year</option>
              <option value="2024-2025">2024–2025</option>
              <option value="2025-2026">2025–2026</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium 
          flex items-center justify-center gap-2
          disabled:opacity-50"
        >
          {pending && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {pending ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
