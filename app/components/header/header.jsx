import Link from "next/link";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

import { checkRole } from "../../../utils/lib/checkRole";
import Image from "next/image";

import { BiShieldQuarter, BiBell } from "react-icons/bi";

export default async function Navbar() {
  const profile = await checkRole();

  const isAdmin = profile?.role == "admin";

  return (
    <nav className="sticky top-0 z-[50] border-b border-white/10 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="    px-3 md:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="  ">
                <div />

                <Image
                  src="/bvmces-logo.png"
                  alt="BVMCES school logo"
                  width={48}
                  height={48}
                  className=" relative"
                />
              </div>

              {/* Text */}
              <div className="  flex-col leading-tight">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-800">
                    BVMCES
                  </h1>

                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                    Portal
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">School ID: 132289</p>
              </div>
            </Link>
          </div>

          {/* Center Desktop Menu */}
          <div className="hidden flex-1 justify-center min-[951px]:flex">
            {profile && <DesktopMenu />}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ">
            {/* Notification Button */}
            <button className="hidden min-[951px]:flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-blue-600">
              <BiBell size={22} />
            </button>

            {/* Mobile */}
            {profile && <MobileMenu isAdmin={isAdmin} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
