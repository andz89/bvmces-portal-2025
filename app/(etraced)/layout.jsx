import { redirect } from "next/navigation";
import { checkRole } from "../../utils/lib/checkRole";

export default async function AuthLayout({ children }) {
  await checkRole();

  return <>{children}</>;
}
