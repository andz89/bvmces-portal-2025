import { NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

/**
 * Run Supabase session logic ONLY on protected routes.
 * This prevents infinite loops on Cloudflare Pages.
 */
export async function middleware(request) {
  const { response } = await updateSession(request);

  // If Supabase needs to modify the response (set cookies, etc)
  if (response) {
    return response;
  }

  // Otherwise, pass through untouched
  return NextResponse.next();
}

/**
 * IMPORTANT:
 * Only protect routes that actually require authentication.
 * Do NOT run globally.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
