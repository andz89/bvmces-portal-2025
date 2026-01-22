// middleware.js
import { NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request) {
  const { response, session } = await updateSession(request);

  // If updateSession already set cookies on response, return that.
  // Otherwise return NextResponse.next()
  return response ?? NextResponse.next();
}

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
};
