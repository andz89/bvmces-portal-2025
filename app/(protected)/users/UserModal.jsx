"use client";

import { useState, useEffect } from "react";

import {
  BiUser,
  BiEnvelope,
  BiLockAlt,
  BiShield,
  BiCheckShield,
  BiX,
} from "react-icons/bi";

import { createUser, updateUser } from "./actions";

import FullPageLoader from "../../components/loader/FullPageLoader";

import { toast } from "react-hot-toast";

export default function UserModal({ open, onClose, user }) {
  const isEdit = Boolean(user?.id);

  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("visitor");

  const [gradeToEdit, setGradeToEdit] = useState([]);

  const grades = [
    {
      label: "Kindergarten",
      value: "kindergarten",
    },

    {
      label: "Grade 1",
      value: "1",
    },

    {
      label: "Grade 2",
      value: "2",
    },

    {
      label: "Grade 3",
      value: "3",
    },

    {
      label: "Grade 4",
      value: "4",
    },

    {
      label: "Grade 5",
      value: "5",
    },

    {
      label: "Grade 6",
      value: "6",
    },
  ];

  const handleGradeChange = (value, checked) => {
    setGradeToEdit((prev) =>
      checked ? [...prev, value] : prev.filter((g) => g !== value),
    );
  };

  useEffect(() => {
    setRole(user?.role ?? "visitor");

    setGradeToEdit(
      Array.isArray(user?.gradeToEdit)
        ? user.gradeToEdit
        : user?.gradeToEdit
          ? [user.gradeToEdit]
          : [],
    );
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const payload = {
        fullName: formData.get("fullName"),

        email: formData.get("email"),

        password: formData.get("password"),

        role,

        gradeToEdit,
      };

      const res = isEdit
        ? await updateUser(user.id, payload)
        : await createUser(payload);

      if (res?.error) {
        toast.error(res.error);

        return;
      }

      toast.success(
        isEdit ? "User updated successfully" : "User created successfully",
      );

      onClose?.();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputClass = `
    w-full
    rounded-2xl
    border
    border-neutral-200
    bg-white
    px-4
    py-3
    text-sm
    text-neutral-700
    outline-none
    transition
    focus:border-neutral-900
    focus:ring-4
    focus:ring-neutral-100
  `;

  return (
    <div className="fixed inset-0 z-[50] overflow-y-auto">
      {loading && <FullPageLoader />}

      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="
            relative
            w-full
            max-w-3xl
            overflow-hidden
            rounded-[32px]
            bg-white
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
          "
        >
          {/* Header */}
          <div
            className="
              border-b
              border-neutral-100
              bg-neutral-50
              px-8
              py-7
            "
          >
            <div className="flex items-start justify-between gap-5">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    h-16
                    w-16
                    rounded-3xl
                    bg-neutral-900
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-sm
                  "
                >
                  <BiUser size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-semibold text-neutral-900">
                    {isEdit ? "Edit User" : "Create User"}
                  </h2>

                  <p className="text-neutral-500 mt-2">
                    Manage user account, permissions, and grade access.
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="
                  h-11
                  w-11
                  rounded-2xl
                  border
                  border-neutral-200
                  flex
                  items-center
                  justify-center
                  text-neutral-500
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-900
                "
              >
                <BiX size={22} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 md:px-8 py-8 space-y-8">
              {/* Basic Info */}
              <div
                className="
                  bg-neutral-50
                  border
                  border-neutral-200
                  rounded-3xl
                  p-6
                "
              >
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                  User Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <BiUser />
                      Full Name
                    </label>

                    <input
                      name="fullName"
                      defaultValue={user?.full_name ?? ""}
                      placeholder="Enter full name"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <BiEnvelope />
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      defaultValue={user?.email ?? ""}
                      placeholder="Enter email"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <BiLockAlt />
                      Password
                    </label>

                    <input
                      type="text"
                      name="password"
                      placeholder={
                        isEdit
                          ? "New password (optional)"
                          : "Temporary password"
                      }
                      required={!isEdit}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Role */}
              <div
                className="
                  bg-neutral-50
                  border
                  border-neutral-200
                  rounded-3xl
                  p-6
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="
                      h-12
                      w-12
                      rounded-2xl
                      bg-neutral-900
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <BiShield size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      User Role
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Assign permissions and access level.
                    </p>
                  </div>
                </div>

                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="visitor">Visitor</option>

                  <option value="editor">Editor</option>

                  <option value="admin">Admin</option>
                </select>

                {/* Role Status */}
                <div className="mt-5">
                  {role === "admin" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-emerald-100
                        bg-emerald-50
                        px-5
                        py-4
                      "
                    >
                      <BiCheckShield className="text-emerald-600" size={24} />

                      <div>
                        <p className="font-semibold text-emerald-700">
                          Full Access Granted
                        </p>

                        <p className="text-sm text-emerald-600">
                          This user can manage all grade levels and system
                          settings.
                        </p>
                      </div>
                    </div>
                  )}

                  {role === "visitor" && (
                    <div
                      className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-neutral-100
                        px-5
                        py-4
                      "
                    >
                      <p className="font-medium text-neutral-700">
                        Read Only Access
                      </p>

                      <p className="text-sm text-neutral-500 mt-1">
                        Visitors cannot edit grade records.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grade Access */}
              {role === "editor" && (
                <div
                  className="
                    bg-neutral-50
                    border
                    border-neutral-200
                    rounded-3xl
                    p-6
                  "
                >
                  <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                    Grade Access
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {grades.map((item) => (
                      <label
                        key={item.value}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          border-neutral-200
                          bg-white
                          px-4
                          py-4
                          cursor-pointer
                          transition
                          hover:border-neutral-400
                        "
                      >
                        <input
                          type="checkbox"
                          checked={gradeToEdit.includes(item.value)}
                          onChange={(e) =>
                            handleGradeChange(item.value, e.target.checked)
                          }
                          className="
                            h-4
                            w-4
                            rounded
                            border-neutral-300
                          "
                        />

                        <span className="text-sm font-medium text-neutral-700">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="
                border-t
                border-neutral-100
                bg-neutral-50
                px-6
                md:px-8
                py-5
                flex
                flex-col
                sm:flex-row
                items-center
                justify-end
                gap-3
              "
            >
              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                className="
                  w-full
                  sm:w-auto
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                  px-6
                  py-3
                  font-medium
                  text-neutral-700
                  transition
                  hover:bg-neutral-100
                "
              >
                Cancel
              </button>

              {/* Submit */}
              <button
                disabled={loading}
                className="
                  w-full
                  sm:w-auto
                  rounded-2xl
                  bg-neutral-900
                  px-7
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                  disabled:opacity-60
                "
              >
                {isEdit ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
