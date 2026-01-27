"use client";

import { useState, useEffect } from "react";
import { createUser, updateUser } from "./actions";
import FullPageLoader from "../../components/loader/FullPageLoader";

export default function UserForm({ user, onClose }) {
  const isEdit = Boolean(user?.id);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "visitor",
    grade: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.full_name ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? "visitor",
        grade: user.grade ?? "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value !== "editor") {
      setForm({ ...form, role: value, grade: "" });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = isEdit
      ? await updateUser(user.id, form)
      : await createUser(form);

    if (res?.error) {
      setMessage(res.error);
    } else {
      onClose?.();
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 border border-neutral-200 rounded-md"
    >
      {loading && <FullPageLoader />}

      {message && (
        <div className="mb-2 border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-800">
          {message}
        </div>
      )}

      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full name"
        required
        className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm
               text-neutral-900 placeholder-neutral-400
               focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm
               text-neutral-900 placeholder-neutral-400
               focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder={isEdit ? "New password (optional)" : "Temporary password"}
        required={!isEdit}
        className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm
               text-neutral-900 placeholder-neutral-400
               focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm
               text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      >
        <option value="visitor">Visitor</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      {form.role === "editor" && (
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          required
          className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm
                 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          <option value="">Select grade</option>
          <option value="kindergarten">Kindergarten</option>
          <option value="grade-1">Grade 1</option>
          <option value="grade-2">Grade 2</option>
          <option value="grade-3">Grade 3</option>
          <option value="grade-4">Grade 4</option>
          <option value="grade-5">Grade 5</option>
          <option value="grade-6">Grade 6</option>
          <option value="implementation">Implementation</option>
        </select>
      )}

      <div className="pt-2">
        <button
          disabled={loading}
          className="border border-neutral-900 bg-neutral-900 text-white rounded
                 px-4 py-2 text-sm font-medium
                 hover:bg-neutral-800
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
