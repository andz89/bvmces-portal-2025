import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

import { checkRole } from "../../../utils/lib/checkRole";
import Image from "next/image";

export default async function Navbar() {
  const profile = await checkRole();
  const isAdmin = profile?.role == "admin";

  return (
    <nav className="border-b border-gray-200 w-full">
      <div className="mx-auto">
        <div className="flex items-center justify-between gap-2 px-1 relative">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/bvmces-logo.png"
              alt="BVMCES school logo"
              width={50}
              height={50}
            />
            <div className="flex flex-col whitespace-nowrap">
              <Link href="/" className="text-xl font-semibold text-neutral-800">
                BVMCES
              </Link>
              <small className="text-neutral-600">SCHOOL ID: 132289</small>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <DesktopMenu />
          </div>

          {/* Mobile */}
          <MobileMenu isAdmin={isAdmin} />
        </div>
      </div>
    </nav>
  );
}
