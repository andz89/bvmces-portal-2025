"use client";

export default function RefreshError({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-sm bg-white p-8 shadow text-center">
        <h2 className="text-lg font-semibold text-lis-danger-text">
          Something went wrong
        </h2>

        <p className="mt-2 text-lis-muted">{message}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-lis-success px-5 py-2 text-white"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
