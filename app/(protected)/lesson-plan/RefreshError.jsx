"use client";

export default function RefreshError({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-xl bg-white p-8 shadow text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Something went wrong
        </h2>

        <p className="mt-2 text-neutral-600">{message}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-emerald-600 px-5 py-2 text-white"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
