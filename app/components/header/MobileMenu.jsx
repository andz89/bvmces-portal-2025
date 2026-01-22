"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {open && (
        <div className="absolute left-0 top-16 w-full border-t bg-white">
          <div className="space-y-1 px-4 py-3">
            <Link href="/access" className="block py-2">
              Access
            </Link>
            <Link href="/equity" className="block py-2">
              Equity
            </Link>
            <Link href="/quality/mps" className="block py-2">
              Quality
            </Link>
            <Link
              href="/logout"
              className="block rounded-md bg-blue-700 px-4 py-2 text-white"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
