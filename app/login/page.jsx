import LoginUserForm from "./LoginUserForm";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";

const SignIn = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <LoginUserForm />;
};

export default SignIn;
