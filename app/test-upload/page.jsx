"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending file:", file.name);
      console.log("Size:", file.size);

      const response = await fetch("/api/test-upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      const result = await response.json();

      console.log("Response:", result);

      setResult(result);
    } catch (error) {
      console.error("Upload error:", error);

      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lis-panel-header p-10">
      <div className="mx-auto max-w-xl rounded-sm bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Upload Test</h1>

        <p className="mb-6 text-sm text-lis-muted">
          This bypasses the Server Action and tests the Route Handler directly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select file
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-lis-panel-border p-3"
            />
          </div>

          {file && (
            <div className="rounded-lg bg-lis-panel-header p-4 text-sm">
              <p>
                <strong>Name:</strong> {file.name}
              </p>

              <p>
                <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p>
                <strong>Type:</strong> {file.type || "Unknown"}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full rounded-lg bg-lis-success px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Test Upload"}
          </button>
        </form>

        {result && (
          <div className="mt-6 rounded-lg bg-lis-panel-header p-4">
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
