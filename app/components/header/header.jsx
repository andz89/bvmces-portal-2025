import Link from "next/link";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

import { checkRole } from "../../../utils/lib/checkRole";
import Image from "next/image";

import { BiShieldQuarter, BiBell } from "react-icons/bi";
import UserInfo from "../UserInfo";
export default async function Navbar() {
  const profile = await checkRole();

  return (
    <nav className="sticky top-0 z-[50] border-b border-white/10 bg-white/80 shadow-sm backdrop-blur-xl  ">
      <div className="    px-3 md:px-2">
        <div className="flex h-15 items-center justify-between gap-1">
          {/* Left */}
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/bvmces-logo.png"
                alt="BVMCES school logo"
                width={48}
                height={48}
              />

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

          <div className="flex items-center justify-end w-full gap-2">
            {/* Center Desktop Menu */}
            <div className="hidden flex-1 justify-center min-[1050px]:flex">
              {profile && <DesktopMenu profile={profile} />}
            </div>
            {/* user info */}
            {profile && <UserInfo profile={profile} />}
            {/* Right */}
            <div className="flex items-center gap-3 ">
              {/* Mobile */}
              {profile && <MobileMenu profile={profile} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
