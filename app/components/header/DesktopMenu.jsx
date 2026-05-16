import Link from "next/link";
import { logout } from "../../auth/actions";
import { createClient } from "../../../utils/supabase/server";

import {
  BiChevronDown,
  BiGridAlt,
  BiBook,
  BiAward,
  BiBarChart,
  BiUser,
  BiLogOut,
  BiFile,
} from "react-icons/bi";

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
    <div className="hidden md:flex items-center justify-end w-full overflow-visible">
      {/* Left Menu */}
      <div className="flex items-center gap-2  px-3 py-1  ">
        {/* Access */}
        <Link
          href="/access"
          className="rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Access
        </Link>

        {/* Equity */}
        <Link
          href="/equity"
          className="rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Equity
        </Link>

        {/* Quality Dropdown */}
        <div className="relative group z-[9999]">
          <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
            <BiBarChart size={18} />
            Quality
            <BiChevronDown size={18} />
          </button>

          <div className="invisible absolute left-0 top-[120%] z-[9999] w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <Link
              href="/mps"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiBarChart size={18} />
              MPS
            </Link>

            <Link
              href="/gpa"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiAward size={18} />
              GPA
            </Link>

            <Link
              href="/rma"
              className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiGridAlt size={18} />
              RMA
            </Link>

            <Link
              href="/phil-iri"
              className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiBook size={18} />
              PHIL-IRI
            </Link>

            <Link
              href="/crla"
              className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiBook size={18} />
              CRLA
            </Link>
          </div>
        </div>

        {/* Other Menus */}
        <Link
          href="/"
          className="max-w-[170px] truncate rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Resiliency & Well-being
        </Link>

        <Link
          href="/"
          className="max-w-[170px] truncate rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
          Enabling Mechanism
        </Link>
      </div>

      {/* Management Dropdown */}
      <div className="relative group z-[9999] ml-2">
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md cursor-pointer">
          <BiGridAlt size={18} />
          Management
          <BiChevronDown size={18} />
        </button>

        <div className="invisible absolute right-0 top-[120%] z-[9999] w-60 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {/* Templates */}
          <Link
            href="/templates"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <BiFile size={18} />
            Templates
          </Link>

          {/* Class */}
          <Link
            href="/class"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <BiGridAlt size={18} />
            Class
          </Link>

          {/* Users */}
          {isAdmin && (
            <Link
              href="/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <BiUser size={18} />
              Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
