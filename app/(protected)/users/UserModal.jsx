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
        grade: role === "visitor" ? "" : formData.get("grade"),
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
    rounded-sm
    border
    border-lis-panel-border
    bg-white
    px-4
    py-3
    text-sm
    text-lis-text
    outline-none
    transition
    focus:border-lis-primary
    focus:ring-4
    focus:ring-lis-primary
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
            rounded-sm
            bg-white
            
          "
        >
          {/* Header */}
          <div
            className="
              border-b
              border-lis-panel-border
              bg-lis-panel-header
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
                    rounded-sm
                    bg-lis-primary
                    text-white
                    flex
                    items-center
                    justify-center
                    
                  "
                >
                  <BiUser size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-semibold text-lis-text">
                    {isEdit ? "Edit User" : "Create User"}
                  </h2>

                  <p className="text-lis-muted mt-2">
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
                  rounded-sm
                  border
                  border-lis-panel-border
                  flex
                  items-center
                  justify-center
                  text-lis-muted
                  transition
                  hover:bg-lis-panel-header
                  hover:text-lis-text
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
                  bg-lis-panel-header
                  border
                  border-lis-panel-border
                  rounded-sm
                  p-6
                "
              >
                <h3 className="text-lg font-semibold text-lis-text mb-6">
                  User Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-lis-text mb-2">
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
                    <label className="flex items-center gap-2 text-sm font-medium text-lis-text mb-2">
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
                  {/* Grade */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-lis-text mb-2">
                      Grade
                    </label>

                    <select
                      type="text"
                      name="grade"
                      disabled={role === "visitor"}
                      required={role !== "visitor" ? true : false}
                      defaultValue={user?.grade ?? ""}
                      className={`  w-full
    rounded-sm
    border
    border-lis-panel-border
    
    px-4
    py-3
    text-sm
    text-lis-text
    outline-none
    transition
    focus:border-lis-primary
    focus:ring-4
    focus:ring-lis-primary  ${role === "visitor" ? "bg-lis-panel-header" : "bg-white"}`}
                    >
                      z
                      <option value="" disabled>
                        Select Grade
                      </option>
                      <option value="">None</option>
                      <option value="kinder">Kindergarten</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="implementation">Implementation</option>
                    </select>
                  </div>
                  {/* Password */}
                  <div className=" ">
                    <label className="flex items-center gap-2 text-sm font-medium text-lis-text mb-2">
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
                  bg-lis-panel-header
                  border
                  border-lis-panel-border
                  rounded-sm
                  p-6
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="
                      h-12
                      w-12
                      rounded-sm
                      bg-lis-primary
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <BiShield size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-lis-text">
                      User Role
                    </h3>

                    <p className="text-sm text-lis-muted">
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
                        rounded-sm
                        border
                        border-lis-panel-border
                        bg-lis-panel-header
                        px-5
                        py-4
                      "
                    >
                      <BiCheckShield className="text-lis-success-text" size={24} />

                      <div>
                        <p className="font-semibold text-lis-success-text">
                          Full Access Granted
                        </p>

                        <p className="text-sm text-lis-success-text">
                          This user can manage all grade levels and system
                          settings.
                        </p>
                      </div>
                    </div>
                  )}

                  {role === "visitor" && (
                    <div
                      className="
                        rounded-sm
                        border
                        border-lis-panel-border
                        bg-lis-panel-header
                        px-5
                        py-4
                      "
                    >
                      <p className="font-medium text-lis-text">
                        Read Only Access
                      </p>

                      <p className="text-sm text-lis-muted mt-1">
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
                    bg-lis-panel-header
                    border
                    border-lis-panel-border
                    rounded-sm
                    p-6
                  "
                >
                  <h3 className="text-lg font-semibold text-lis-text mb-6">
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
                          rounded-sm
                          border
                          border-lis-panel-border
                          bg-white
                          px-4
                          py-4
                          cursor-pointer
                          transition
                          hover:border-lis-panel-border
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
                            border-lis-panel-border
                          "
                        />

                        <span className="text-sm font-medium text-lis-text">
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
                border-lis-panel-border
                bg-lis-panel-header
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
                  rounded-sm
                  border
                  border-lis-panel-border
                  bg-white
                  px-6
                  py-3
                  font-medium
                  text-lis-text
                  transition
                  hover:bg-lis-panel-header
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
                  rounded-sm
                  bg-lis-primary
                  px-7
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-lis-primary
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
