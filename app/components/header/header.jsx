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
        <div className="flex h-15 items-center justify-between gap-1">
          {/* Left */}
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="  ">
                <div />

                <Image
                  src="/bvmces-logo.png"
                  alt="BVMCES school logo"
                  width={38}
                  height={38}
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

                <p className="  text-xs text-slate-500">School ID: 132289</p>
              </div>
            </Link>
          </div>

          {/* Center Desktop Menu */}
          <div className="hidden flex-1 justify-center min-[951px]:flex">
            {profile && <DesktopMenu />}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ">
            {/* Mobile */}
            {profile && <MobileMenu isAdmin={isAdmin} />}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end gap-4  w-full bg-slate-200  px-3 py-1">
          {profile && (
            <div
              className="
      max-w-290
   bg-white/80
   p-1
   rounded
    "
            >
              {/* Info */}
              <div className="min-w-0 leading-tight flex gap-2">
                <div className=" flex items-center gap-2">
                  <span
                    className="
            rounded-full
            bg-slate-100
            px-2  
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            text-slate-600
          "
                  >
                    {profile?.role ?? "visitor"}
                  </span>
                </div>
                <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                  {profile?.email ?? "Unknown User"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
