"use client";

import FullPageLoader from "../../components/loader/FullPageLoader";
import { deleteUser } from "./actions";
import { useState } from "react";

export default function DeleteUserButton({ userId }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      setLoading(true); // ✅ show loader
      await deleteUser(userId);
    } finally {
      setLoading(false); // ✅ hide loader (even on error)
    }
  }

  return (
    <>
      {loading && <FullPageLoader />}
      <button
        onClick={handleDelete}
        className="text-red-600 hover:underline text-sm"
        disabled={loading}
      >
        Delete
      </button>
    </>
  );
}
