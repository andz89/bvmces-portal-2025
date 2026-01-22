"use client";

import { useState } from "react";
import DeleteUserButton from "./DeleteUserButton";
import UserModal from "./UserModal";

export default function UserTable({ users }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-white rounded-lg p-6">
      <button
        onClick={() => {
          setSelectedUser(null);
          setOpen(true);
        }}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 text-sm rounded"
      >
        Add User
      </button>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 w-[25%] text-left">Name</th>
              <th className="px-3 py-2 w-[30%] text-left">Email</th>
              <th className="px-3 py-2 w-[15%] text-left">Role</th>
              <th className="px-3 py-2 w-[15%] text-left">Grade</th>
              <th className="px-3 py-2 w-[15%] text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-3 py-2 truncate">{user.full_name}</td>
                <td className="px-3 py-2 truncate">{user.email}</td>
                <td className="px-3 py-2 capitalize">{user.role}</td>
                <td className="px-3 py-2">
                  {user.grade.trim().toUpperCase().replace("-", " ") ?? "-"}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpen(true);
                    }}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Edit
                  </button>

                  <DeleteUserButton userId={user.id} />
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
