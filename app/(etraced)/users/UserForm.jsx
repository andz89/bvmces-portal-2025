"use client";

import { useState, useEffect } from "react";
import { createUser, updateUser } from "./actions";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full name"
        required
        className="w-full border p-2 text-sm"
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border p-2 text-sm"
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder={isEdit ? "New password (optional)" : "Temporary password"}
        required={!isEdit}
        className="w-full border p-2 text-sm"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border p-2 text-sm"
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
          className="w-full border p-2 text-sm"
        >
          <option value="">Select grade</option>
          <option value="grade-1">Grade 1</option>
          <option value="grade-2">Grade 2</option>
          <option value="grade-3">Grade 3</option>
          <option value="grade-4">Grade 4</option>
          <option value="grade-5">Grade 5</option>
          <option value="grade-6">Grade 6</option>
          <option value="implementation">Implementation</option>
        </select>
      )}

      <div className="flex justify-between items-center">
        <button
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 text-sm rounded"
        >
          {isEdit ? "Update User" : "Create User"}
        </button>

        {message && <span className="text-sm text-red-600">{message}</span>}
      </div>
    </form>
  );
}
