"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../auth/actions";

export default function MobileMenu({ isAdmin }) {
  const [open, setOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
    setQualityOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden px-1">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-neutral-800 border border-neutral-300 rounded
                   hover:bg-neutral-100"
        aria-label="Open menu"
      >
        ☰
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50
                 bg-white border border-neutral-200 shadow-sm "
        >
          <div className="mx-auto   px-4">
            <nav className="flex flex-col divide-y divide-neutral-200 text-sm">
              <Link href="/access" className="px-4 py-3 hover:bg-neutral-50">
                Access
              </Link>

              <Link href="/equity" className="px-4 py-3 hover:bg-neutral-50">
                Equity
              </Link>

              {/* Quality */}
              <button
                onClick={() => setQualityOpen(!qualityOpen)}
                className="px-4 py-3 text-left hover:bg-neutral-50
                         flex items-center justify-between"
              >
                <span>Quality</span>
                <span className="text-neutral-400">
                  {qualityOpen ? "−" : "+"}
                </span>
              </button>

              {qualityOpen && (
                <div className="bg-neutral-50 border-t border-neutral-200">
                  <Link
                    href="/mps"
                    className="block px-6 py-3 hover:bg-neutral-100"
                  >
                    MPS
                  </Link>
                  <Link
                    href="/gpa"
                    className="block px-6 py-3 hover:bg-neutral-100"
                  >
                    GPA
                  </Link>
                  <Link
                    href="/"
                    className="block px-6 py-3 hover:bg-neutral-100"
                  >
                    Diagnostic
                  </Link>
                  <Link
                    href="/"
                    className="block px-6 py-3 hover:bg-neutral-100"
                  >
                    RMA
                  </Link>
                </div>
              )}

              <Link href="/" className="px-4 py-3 hover:bg-neutral-50">
                Resiliency &amp; Well-being
              </Link>

              <Link href="/" className="px-4 py-3 hover:bg-neutral-50">
                Enabling Mechanism
              </Link>

              <Link
                href="/class"
                className="px-4 py-3 font-medium hover:bg-neutral-50"
              >
                Class
              </Link>

              {isAdmin && (
                <Link
                  href="/users"
                  className="px-4 py-3 font-medium hover:bg-neutral-50"
                >
                  Users
                </Link>
              )}

              <form className="p-4">
                <button
                  formAction={logout}
                  className="w-full border border-neutral-900 bg-neutral-900
                           text-white px-4 py-2 text-sm
                           hover:bg-neutral-800"
                >
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
