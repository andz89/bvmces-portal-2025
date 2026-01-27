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
    <nav className=" border-b border-gray-200 w-full">
      <div className="  mx-auto ">
        <div className="flex h-18 items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-3 px-1">
            <Image
              src="/bvmces-logo.png"
              alt="My photo"
              className="mx-auto"
              width={50}
              height={50}
            />
            <div className="flex flex-col">
              <Link href="/" className="text-xl font-semibold text-neural-800 ">
                BVMCES
              </Link>
              <small className="text-neutral-600">SCHOOL ID: 132289</small>
            </div>
          </div>

          {/* Desktop */}
          <DesktopMenu />

          {/* Mobile */}
          <MobileMenu isAdmin={isAdmin} />
        </div>
      </div>
    </nav>
  );
}
