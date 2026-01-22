"use client";

import UserForm from "./UserForm";

export default function UserModal({ open, onClose, user }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>

        <UserForm user={user} onClose={onClose} />
      </div>
    </div>
  );
}
