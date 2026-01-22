import { redirect } from "next/navigation";
import { checkRole } from "../../utils/lib/checkRole";

export default async function AuthLayout({ children }) {
  const profile = await checkRole();

  return <>{children}</>;
}
