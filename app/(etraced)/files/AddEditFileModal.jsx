"use client";

import { useState, useTransition } from "react";
import { addFile, updateFile } from "./actions";
import FullPageLoader from "../../components/loader/FullPageLoader";

export default function AddEditFileModal({ file }) {
  const isEdit = Boolean(file);
  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    startTransition(async () => {
      if (isEdit) {
        await updateFile(formData);
        setMessage("File updated successfully.");
      } else {
        await addFile(formData);
        setMessage("File added successfully.");
      }

      setOpen(false);

      // auto-clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    });
  }

  return (
    <>
      {isPending && <FullPageLoader />}
      {message && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
          {message}
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          isEdit
            ? "text-blue-600 hover:underline"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        {isEdit ? "Edit" : "+ Add File"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {isEdit ? "Edit File" : "Add File"}
            </h2>

            <form action={handleSubmit} className="space-y-4">
              {isEdit && <input type="hidden" name="id" value={file.id} />}
              <label className="text-neutral-600 text-sm">Title</label>
              <input
                name="title"
                defaultValue={file?.title}
                required
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <label className="text-neutral-600 text-sm">Description</label>

              <textarea
                name="description"
                defaultValue={file?.description}
                rows={3}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <label className="text-neutral-600 text-sm">Link</label>

              <input
                name="link"
                defaultValue={file?.link}
                required
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <label className="text-neutral-600 text-sm">Type</label>

              <select
                name="type"
                defaultValue={file?.type || ""}
                required
                className="w-full rounded-md border bg-white px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                <option value="school">School</option>
                <option value="principal">Principal</option>
                <option value="teachers">Teachers</option>
                <option value="pupils">Pupils</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isPending ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
