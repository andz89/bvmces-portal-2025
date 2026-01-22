import { createClient } from "@supabase/supabase-js";
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role (secret)
);
export const emailExists = async (email) => {
  const { data, error } = await supabaseAdmin.rpc("check_email_info", {
    p_email: email,
  });

  if (error) {
    console.error("check_email_info error", error);
    return { email_exists: false, email_confirmed: false };
  }

  const info = data?.[0] ?? { email_exists: false, email_confirmed: false };
  // console.log(info.email_exists, info.email_confirmed);
  return info;
};
