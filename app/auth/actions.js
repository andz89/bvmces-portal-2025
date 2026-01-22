"use server";
import { SignJWT } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { emailExists } from "../../utils/supabase/admin";
import { rateLimit } from "../../utils/lib/rateLimit";
import { headers } from "next/headers";
const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});
export async function login(formData) {
  const supabase = await createClient();
  const ip = headers()["x-forwarded-for"] ?? "unknown";

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // Rate limit check
  const check = rateLimit(ip, 5, 60_000); // 5 attempts per minute
  if (!check.allowed) {
    return "Too many login attempts. Try again later.";
  }

  // 1. Validate input
  const parseResult = LoginSchema.safeParse(rawData);

  if (!parseResult.success) {
    const firstError =
      parseResult.error?.issues?.[0]?.message || "Invalid input.";
    return firstError;
  }

  const data = parseResult.data;

  // 2. Sign in
  const { error } = await supabase.auth.signInWithPassword(data);

  // Email exists but not verified
  if (error?.message.includes("Email not confirmed")) {
    return "Email already registered but NOT verified. Check your inbox.";
  }

  // Any other login error
  if (error) {
    return error.message;
  }

  // 3. Success → redirect
  revalidatePath("/", "layout");
  redirect("/");
}

// export async function signUp(formData) {
//   const supabase = await createClient();
//   const data = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   const info = await emailExists(data.email);

//   if (info.email_exists) {
//     // User found in table

//     if (!info.email_confirmed) {
//       return "Email already registered but NOT verified. Check your inbox.";
//     }

//     return "Email already registered. Please login instead.";
//   }
//   const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//     email: data.email,
//     password: data.password,
//   });

//   if (signUpError) {
//     return signUpError.message;
//   }

//   const user = signUpData.user;

//   // 2️⃣ Insert a copy in your users table
//   const { error: insertError } = await supabaseAdmin.from("users").insert([
//     {
//       id: user.id,
//       email: user.email,
//       phone: null,
//       account_status: "active",
//       user_metadata: {},
//     },
//   ]);
//   if (insertError) {
//     return "Error in signup";
//   }
//   return "Sign up successful! Please verify your email.";
// }

import { z } from "zod";

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
