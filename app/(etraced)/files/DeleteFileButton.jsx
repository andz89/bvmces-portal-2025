"use client";

import { deleteFile } from "./actions";
import { useState } from "react";
import FullPageLoader from "../../components/loader/FullPageLoader";
export default function DeleteFileButton({ fileId }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this file?")) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("id", fileId);

    await deleteFile(formData);

    setLoading(false);
  }

  return (
    <>
      {loading && <FullPageLoader />}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </>
  );
}
