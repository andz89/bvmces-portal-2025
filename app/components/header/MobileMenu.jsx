"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../login/actions";

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
  BiShield,
  BiFile,
  BiHomeAlt,
  BiTargetLock,
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
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-lis-panel-border bg-lis-panel-header text-lis-text transition hover:bg-lis-tab-active"
        aria-label="Open menu"
      >
        {open ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/40 " />
      )}
      {open && (
        <div className="fixed h-full h-screen inset-y-0 right-0 z-[9999] w-full max-w-sm bg-white    ">
          {/* Header */}
          <div className="relative overflow-hidden bg-lis-primary px-6 py-8 text-white">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">School Portal</p>
                <h2 className="mt-1 text-2xl font-bold">Navigation</h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 hover:bg-white/20"
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
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiHomeAlt size={22} />
                Access
              </Link>

              {/* Equity */}
              <Link
                href="/equity"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiGridAlt size={22} />
                Equity
              </Link>

              {/* Quality */}
              <div className="rounded-sm border border-lis-panel-border bg-lis-panel-header">
                <button
                  onClick={() => setQualityOpen(!qualityOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-lis-text"
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
                  <div className="space-y-1 border-t border-lis-panel-border p-2">
                    <Link
                      href="/mps"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiBarChart size={18} />
                      MPS
                    </Link>

                    <Link
                      href="/mps-term"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiBarChart size={18} />
                      MPS Term
                    </Link>

                    <Link
                      href="/gpa"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiAward size={18} />
                      GPA
                    </Link>

                    <Link
                      href="/gpa-term"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiAward size={18} />
                      GPA Term
                    </Link>

                    <Link
                      href="/llc"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiTargetLock size={18} />
                      LLC
                    </Link>

                    <Link
                      href="/summative-test"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiBook size={18} />
                      Summative Test
                    </Link>

                    <Link
                      href="/school-forms"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiFile size={18} />
                      School Forms
                    </Link>

                    {/* <Link
                      href="/rma"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiGridAlt size={18} />
                      RMA
                    </Link> */}

                    {/* <Link
                      href="/phil-iri"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiBook size={18} />
                      PHIL-IRI
                    </Link> */}

                    {/* <Link
                      href="/crla"
                      className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-white"
                    >
                      <BiBook size={18} />
                      CRLA
                    </Link> */}
                  </div>
                )}
              </div>

              {/* Others */}
              <Link
                href="/"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiBook size={22} />
                Resiliency & Well-being
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiGridAlt size={22} />
                Enabling Mechanism
              </Link>

              {/* Templates */}
              <Link
                href="/templates"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiFile size={22} />
                Templates
              </Link>

              {/* Class */}
              <Link
                href="/class"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiGridAlt size={22} />
                Class
              </Link>

              {/* Users */}
              {profile.role === "admin" && (
                <>
                  <Link
                    href="/admin-dashboard"
                    className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
                  >
                    <BiShield size={22} />
                    Admin
                  </Link>
                  <Link
                    href="/users"
                    className="flex items-center gap-3 rounded-sm px-4 py-3 text-lis-text transition hover:bg-lis-panel-header"
                  >
                    <BiUser size={22} />
                    Users
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
