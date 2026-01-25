"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "../../auth/actions";

export default function MobileMenu({ isAdmin }) {
  const [open, setOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <button onClick={() => setOpen(!open)} className="p-2 text-gray-700">
        ☰
      </button>

      {open && (
        <div className="absolute left-0   z-50 w-full bg-white border shadow-md ">
          <nav className="flex flex-col divide-y">
            <Link href="/access" className="p-4">
              Access
            </Link>

            <Link href="/equity" className="p-4">
              Equity
            </Link>

            {/* Quality */}
            <button
              onClick={() => setQualityOpen(!qualityOpen)}
              className="p-4 text-left"
            >
              Quality
            </button>

            {qualityOpen && (
              <div className="bg-gray-50">
                <Link href="/mps" className="block p-4 pl-8">
                  MPS
                </Link>
                <Link href="/gpa" className="block p-4 pl-8">
                  GPA
                </Link>
                <Link href="/" className="block p-4 pl-8">
                  Diagnostic
                </Link>
                <Link href="/" className="block p-4 pl-8">
                  RMA
                </Link>
              </div>
            )}

            <Link href="/" className="p-4">
              Resiliency & Well-being
            </Link>

            <Link href="/" className="p-4">
              Enabling Mechanism
            </Link>

            <Link href="/class" className="p-4 text-blue-600">
              Class
            </Link>

            {isAdmin && (
              <Link href="/users" className="p-4 text-blue-600">
                Users
              </Link>
            )}

            <form className="p-4">
              <button
                formAction={logout}
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
}
