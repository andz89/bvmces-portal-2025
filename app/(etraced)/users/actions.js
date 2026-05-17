"use server";

import { createClient } from "../../../utils/supabase/server";
import { supabaseAdmin } from "../../../utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const baseString = z.string().trim().min(1, "Required");

const optionalString = z.string().trim().optional().or(z.literal(""));

const optionalEmail = optionalString.transform((v) =>
  typeof v === "string" ? v.toLowerCase() : v,
);

const updateUserSchema = z.object({
  email: optionalEmail,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  fullName: optionalString,
  role: optionalString,
  gradeToEdit: z.array(z.string()).optional().default([]),
});

const createUserSchema = z.object({
  email: baseString.transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),

  fullName: baseString,
  role: baseString,
  gradeToEdit: z.array(z.string()).optional().default([]),
});

export async function createUser(form) {
  const parsed = createUserSchema.safeParse(form);

  if (!parsed.success) {
    return {
      error: parsed.error.issues?.[0]?.message || "Invalid form data",
    };
  }
  form = parsed.data;

  const supabase = await createClient();
  /* -------------------------------------------------
     0. Check if email already exists
  -------------------------------------------------- */
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", form.email)
    .maybeSingle();

  if (existingUser) {
    return { error: "Email is already taken" };
  }
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
     2. Admin check
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
     3. Validation
  -------------------------------------------------- */
  if (!form.email || !form.password || !form.fullName) {
    return {
      error: "Email, password, and full name are required",
    };
  }

  if (!form.role) {
    return { error: "Role is required" };
  }

  // editor must have at least one grade
  if (
    form.role === "editor" &&
    (!form.gradeToEdit || form.gradeToEdit.length === 0)
  ) {
    return {
      error: "Please select at least one grade level",
    };
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
     5. Create profile
  -------------------------------------------------- */
  const { error: profileError } = await supabase.from("users").insert({
    id: data.user.id,
    full_name: form.fullName,
    email: form.email,
    role: form.role,
    gradeToEdit: form.role === "editor" ? form.gradeToEdit : [],
  });

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/admin-dahsboard");

  return { success: true };
}
export async function updateUser(id, data) {
  // editor must have at least one grade

  if (
    data.role === "editor" &&
    (!data.gradeToEdit || data.gradeToEdit.length === 0)
  ) {
    return {
      error: "Please select at least one grade level",
    };
  }

  const parsed = updateUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.issues?.[0]?.message || "Invalid form data",
    };
  }

  data = parsed.data;

  const supabase = await createClient();

  /* -------------------------------
     1. Update profile
  -------------------------------- */
  const payload = {
    full_name: data.fullName,
    role: data.role,
    gradeToEdit: data.role === "editor" ? data.gradeToEdit : null,
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
      },
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
      },
    );

    if (pwError) {
      return { error: pwError.message };
    }
  }
  revalidatePath("/users");

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
  const { error: authDeleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return { error: authDeleteError.message };
  }
  revalidatePath("/admin-dahsboard");

  return { success: true };
}
