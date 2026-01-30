import Link from "next/link";
import { logout } from "../../auth/actions";
import { createClient } from "../../../utils/supabase/server";

export default async function DesktopMenu() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let isEditor = false;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
    isEditor = profile?.role === "editor";
  }
  if (!user) return null;

  return (
    <div className="flex item-center gap-2">
      <div className="hidden  md:flex   gap-8  justify-center  items-center w-full">
        <Link href="/access" className="text-gray-700 hover:text-blue-700 ">
          Access
        </Link>

        <Link href="/equity" className="text-gray-700 hover:text-blue-700 ">
          Equity
        </Link>

        {/* Quality Dropdown */}
        <div className="relative group  ">
          <span className="cursor-pointer text-gray-700 hover:text-blue-700">
            Quality
          </span>

          <div className="absolute left-0 top-full z-50 hidden w-48 border bg-white shadow-md group-hover:block">
            <Link
              href="/mps"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              MPS
            </Link>
            <Link
              href="/gpa"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              GPA
            </Link>
            <Link
              href="/ "
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Diagnostic
            </Link>
            <Link
              href=" "
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              RMA
            </Link>
          </div>
        </div>

        <Link href="/" className="text-gray-700 hover:text-blue-700 ">
          Resiliency & Well-being
        </Link>

        <Link href="/ " className="text-gray-700 hover:text-blue-700 ">
          Enabling Mechanism
        </Link>

        {/* ✅ Admin-only menu item */}
      </div>

      <div className="hidden md:flex items-center gap-4 px-2">
        <Link href="/files " className="text-blue-600 ">
          Files
        </Link>
        <Link href="/class" className="text-blue-600     ">
          Class
        </Link>
        {isAdmin && (
          <div>
            <Link href="/users" className="text-blue-600     ">
              Users
            </Link>
          </div>
        )}
        <form>
          <button
            formAction={logout}
            className=" bg-blue-500 text-white font-medium rounded shadow-sm p-2 w-full"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
