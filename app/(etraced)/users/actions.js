"use server";

import { createClient } from "../../../utils/supabase/server";
import { supabaseAdmin } from "../../../utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createUser(form) {
  const supabase = await createClient();

  /* -------------------------------------------------
     1. Auth check (must be logged in)
  -------------------------------------------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  /* -------------------------------------------------
     2. Role check (admin only)
     ⚠️ Adjust column/table names if needed
  -------------------------------------------------- */
  const { data: adminProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return { error: "Access denied" };
  }

  /* -------------------------------------------------
     3. Basic validation (server-side)
  -------------------------------------------------- */
  // Always required
  if (!form.email || !form.password || !form.fullName) {
    return { error: "Email, password, and full name are required" };
  }

  // Role is required unless visitor
  if (!form.role && form.role !== "visitor") {
    return { error: "Role is required" };
  }

  // Grade is required for non-admin roles
  if (!form.role === "editor" && !form.grade) {
    return { error: "Grade is required" };
  }

  /* -------------------------------------------------
     4. Create auth user
  -------------------------------------------------- */
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: form.email,
    password: form.password,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  /* -------------------------------------------------
     5. Create profile row
  -------------------------------------------------- */
  const { error: profileError } = await supabase.from("users").insert({
    id: data.user.id,
    full_name: form.fullName,
    email: form.email,
    role: form.role,
    grade: form.grade.trim().toLowerCase().replace(" ", "-"),
  });

  if (profileError) {
    return { error: profileError.message };
  }
  revalidatePath("/admin-dahsboard");

  return { success: true };
}
export async function updateUser(id, data) {
  const supabase = await createClient();

  /* -------------------------------
     1. Update profile
  -------------------------------- */
  const payload = {
    full_name: data.fullName,
    role: data.role,
    grade: data.role === "editor" ? data.grade : null,
    email: data.email,
  };

  const { error } = await supabase.from("users").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  /* -------------------------------
     2. Update auth email
  -------------------------------- */
  if (data.email) {
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      {
        email: data.email,
      }
    );

    if (emailError) {
      return { error: emailError.message };
    }
  }

  /* -------------------------------
     3. Update auth password
     (auto-revokes sessions)
  -------------------------------- */
  if (data.password) {
    const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      {
        password: data.password,
      }
    );

    if (pwError) {
      return { error: pwError.message };
    }
  }
  revalidatePath("/admin-dahsboard");

  return {
    success: true,
    passwordChanged: Boolean(data.password),
    emailChanged: Boolean(data.email),
  };
}

export async function deleteUser(userId) {
  const supabase = await createClient();

  /* -------------------------------------------------
     1. Auth check
  -------------------------------------------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  /* -------------------------------------------------
     2. Admin role check
  -------------------------------------------------- */
  const { data: adminProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return { error: "Access denied" };
  }

  /* -------------------------------------------------
     3. Delete profile row (RLS enforced)
  -------------------------------------------------- */
  const { error: profileError } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (profileError) {
    return { error: profileError.message };
  }

  /* -------------------------------------------------
     4. Delete auth user (admin client only)
  -------------------------------------------------- */
  const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );

  if (authDeleteError) {
    return { error: authDeleteError.message };
  }
  revalidatePath("/admin-dahsboard");

  return { success: true };
}
