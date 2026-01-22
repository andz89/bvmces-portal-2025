import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          // Write refreshed auth cookies onto the response
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get current session (use getSession so you get the session object)
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // ✅ Gracefully handle invalid refresh token
  if (error?.code === "refresh_token_not_found") {
    return { response, session: null };
  }

  return { response, session };
}
