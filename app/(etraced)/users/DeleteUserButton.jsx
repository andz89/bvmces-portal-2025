"use client";

import { deleteUser } from "./actions";

export default function DeleteUserButton({ userId }) {
  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    await deleteUser(userId);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline text-sm"
    >
      Delete
    </button>
  );
}
