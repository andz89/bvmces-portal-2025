import { redirect } from "next/navigation";
import { checkRole } from "../../utils/lib/checkRole";

export default async function layout({ children }) {
  const profile = await checkRole();
  if (profile === null) {
    redirect("/");
  }

  return <div className="">{children}</div>;
}
