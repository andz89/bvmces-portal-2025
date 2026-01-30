"use client";
import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import AddEditFileModal from "./AddEditFileModal";
import DeleteFileButton from "./DeleteFileButton";
import FullPageLoader from "../../components/loader/FullPageLoader";
export default function FilesClient({ profile, email, files, selectedType }) {
  const [localType, setLocalType] = useState(selectedType);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    setLocalType(selectedType);
  }, [selectedType]);

  function handleChange(e) {
    const value = e.target.value.toLowerCase();

    // ✅ update UI immediately
    setLocalType(value);

    startTransition(() => {
      router.push(`?type=${value}`);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Files</h1>
        <AddEditFileModal />
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={localType}
          onChange={handleChange}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="school">School</option>
          <option value="principal">Principal</option>
          <option value="teachers">Teachers</option>
          <option value="pupils">Pupils</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-4  ">
        {isPending && <FullPageLoader />}
        {files.map((file) => (
          <div
            key={file.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-base font-semibold text-gray-800">
                {file.title}
              </h3>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                {file.type}
              </span>
            </div>

            <p className="mb-4 text-sm text-gray-600">{file.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Created by: {file.created_by}
              </span>
              <div className="flex items-center gap-3">
                {(file.created_by === email || profile.role === "admin") && (
                  <>
                    <DeleteFileButton fileId={file.id} />
                    <AddEditFileModal file={file} />
                  </>
                )}

                <a
                  href={file.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View file →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!isPending && selectedType && files.length === 0 && (
        <div className="mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
          No files found.
        </div>
      )}
    </div>
  );
}
