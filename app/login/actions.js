"use server";
import { SignJWT } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { emailExists } from "../../utils/supabase/admin";
import { rateLimit } from "../../utils/lib/rateLimit";
import { headers } from "next/headers";
import { z } from "zod";
const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});
export async function login(formData) {
  const supabase = await createClient();

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Rate limit check
  const check = rateLimit(ip, 5, 60_000);

  if (!check.allowed) {
    return "Too many login attempts. Try again later.";
  }

  // Validate input
  const parseResult = LoginSchema.safeParse(rawData);

  if (!parseResult.success) {
    const firstError =
      parseResult.error?.issues?.[0]?.message || "Invalid input.";

    return firstError;
  }

  const data = parseResult.data;
  console.log(data);
  // CHECK USER ARCHIVE STATUS FIRST
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("archive")
    .eq("email", data.email)
    .single();

  // Optional: handle DB error
  if (userError && userError.code !== "PGRST116") {
    return "Something went wrong.";
  }

  // If archived, block login
  if (userData?.archive === true) {
    return "Your account has been blocked. Please contact admin.";
  }

  // Sign in
  const { error } = await supabase.auth.signInWithPassword(data);

  // Email exists but not verified
  if (error?.message.includes("Email not confirmed")) {
    return "Email already registered but NOT verified. Check your inbox.";
  }

  // Any other login error
  if (error) {
    return error.message;
  }

  // Success
  revalidatePath("/", "layout");
  redirect("/");
}

const SignUpSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
});

export async function signUp(formData) {
  const supabase = await createClient();
  const ip = headers()["x-forwarded-for"] ?? "unknown";
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // // Rate limit check
  // const check = rateLimit(ip, 5, 5 * 60_000); // 5 attempts per minute
  // if (!check.allowed) {
  //   return "Too many login attempts. Try again later after 5 minutes.";
  // }

  // 🔍 1. Validate with Zod
  const parseResult = SignUpSchema.safeParse(rawData);

  if (!parseResult.success) {
    const firstError =
      parseResult.error?.issues?.[0]?.message || "Invalid input.";
    return firstError;
  }

  const data = parseResult.data;

  // 🔍 2. Check existing email
  const info = await emailExists(data.email);

  if (info.email_exists) {
    if (!info.email_confirmed) {
      return "Email already registered but NOT verified. Check your inbox.";
    }
    return "Email already registered. Please login instead.";
  }

  // 🔍 3. Create auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) {
    return signUpError.message;
  }
  const token = await new SignJWT({ ok: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60s")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  redirect(`/successful?token=${token}`);

  // return "Sign up successful! Please verify your email.";
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
