import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  // const supabase = await createClient();
  // const { data } = await supabase.auth.getUser();

  // if (!data.user) return null;

  return (
    <nav className=" border-b border-gray-200 w-full">
      <div className="  mx-auto px-4">
        <div className="flex h-16 items-center  justify-between  w-full  ">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-blue-700  w-[300px]"
          >
            BVMCES Portal
          </Link>

          {/* Desktop */}
          <DesktopMenu />

          {/* Mobile */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
