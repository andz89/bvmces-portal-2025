"use client";

import { useState } from "react";
import DeleteUserButton from "./DeleteUserButton";
import UserModal from "./UserModal";

export default function UserTable({ users }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-white border border-neutral-200 rounded-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-neutral-900">Users</h2>

        <button
          onClick={() => {
            setSelectedUser(null);
            setOpen(true);
          }}
          className="border border-neutral-900 bg-neutral-900 text-white rounded
                 px-4 py-2 text-sm font-medium
                 hover:bg-neutral-800"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse   text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-3 py-2   text-left font-medium text-neutral-700">
                Name
              </th>
              <th className="px-3 py-2   text-left font-medium text-neutral-700">
                Email
              </th>
              <th className="px-3 py-2   text-left font-medium text-neutral-700">
                Role
              </th>
              <th className="px-3 py-2  text-left font-medium text-neutral-700">
                Grade
              </th>
              <th className="px-3 py-2  text-right font-medium text-neutral-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-neutral-200 last:border-b-0
                       hover:bg-neutral-50"
              >
                <td className="px-3 py-2 truncate text-neutral-900">
                  {user.full_name}
                </td>
                <td className="px-3 py-2 truncate text-neutral-700">
                  {user.email}
                </td>
                <td className="px-3 py-2 capitalize text-neutral-700">
                  {user.role}
                </td>
                <td className="px-3 py-2 text-neutral-700">
                  {user.grade?.trim().toUpperCase().replace("-", " ") ?? "-"}
                </td>
                <td className="px-3 py-2 text-right space-x-3">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpen(true);
                    }}
                    className="inline-flex items-center px-2 py-1 text-sm
             text-neutral-800 border border-transparent
             hover:border-neutral-300 hover:bg-neutral-50
             rounded"
                  >
                    Edit
                  </button>

                  <DeleteUserButton
                    className="inline-flex items-center px-2 py-1 text-sm
             text-neutral-500 border border-transparent
             hover:border-neutral-300 hover:bg-neutral-50
             hover:text-neutral-900
             rounded"
                    userId={user.id}
                  />
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-neutral-500"
                >
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
