"use client";

export default function ScanResultModal({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-sm bg-white p-6 ">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Scan Result</h2>

          <button
            onClick={onClose}
            className="text-2xl text-lis-muted hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-lis-muted">Value</p>
            <p className="break-all font-medium">{result.rawValue}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
