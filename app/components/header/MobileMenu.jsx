"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../auth/actions";

import {
  BiMenu,
  BiX,
  BiChevronDown,
  BiChevronUp,
  BiBarChart,
  BiBook,
  BiAward,
  BiGridAlt,
  BiUser,
  BiLogOut,
  BiFile,
  BiHomeAlt,
} from "react-icons/bi";

export default function MobileMenu({ profile }) {
  const [open, setOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
    setQualityOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [open]);
  return (
    <div className="min-[1050px]:hidden overflow-x-hidden ">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
        aria-label="Open menu"
      >
        {open ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
      )}
      {open && (
        <div className="fixed h-full h-screen inset-y-0 right-0 z-[9999] w-full max-w-sm bg-white shadow-2xl   ">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-8 text-white">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">School Portal</p>
                <h2 className="mt-1 text-2xl font-bold">Navigation</h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur hover:bg-white/20"
              >
                <BiX size={24} />
              </button>
            </div>
          </div>

          {/* Menu */}
          <div className="flex h-[calc(100vh-112px)] flex-col">
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
              {/* Access */}
              <Link
                href="/access"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiHomeAlt size={22} />
                Access
              </Link>

              {/* Equity */}
              <Link
                href="/equity"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiGridAlt size={22} />
                Equity
              </Link>

              {/* Quality */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50">
                <button
                  onClick={() => setQualityOpen(!qualityOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <BiBarChart size={22} />
                    <span>Quality</span>
                  </div>

                  {qualityOpen ? (
                    <BiChevronUp size={22} />
                  ) : (
                    <BiChevronDown size={22} />
                  )}
                </button>

                {qualityOpen && (
                  <div className="space-y-1 border-t border-slate-200 p-2">
                    <Link
                      href="/mps"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                    >
                      <BiBarChart size={18} />
                      MPS
                    </Link>

                    <Link
                      href="/gpa"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                    >
                      <BiAward size={18} />
                      GPA
                    </Link>

                    <Link
                      href="/rma"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                    >
                      <BiGridAlt size={18} />
                      RMA
                    </Link>

                    <Link
                      href="/phil-iri"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                    >
                      <BiBook size={18} />
                      PHIL-IRI
                    </Link>

                    <Link
                      href="/crla"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                    >
                      <BiBook size={18} />
                      CRLA
                    </Link>
                  </div>
                )}
              </div>

              {/* Others */}
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiBook size={22} />
                Resiliency & Well-being
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiGridAlt size={22} />
                Enabling Mechanism
              </Link>

              {/* Templates */}
              <Link
                href="/templates"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiFile size={22} />
                Templates
              </Link>

              {/* Class */}
              <Link
                href="/class"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <BiGridAlt size={22} />
                Class
              </Link>

              {/* Users */}
              {profile.role === "admin" && (
                <Link
                  href="/users"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <BiUser size={22} />
                  Users
                </Link>
              )}

              <div className="border-t border-slate-200 p-4">
                <form>
                  <button
                    formAction={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
                  >
                    <BiLogOut size={20} />
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
