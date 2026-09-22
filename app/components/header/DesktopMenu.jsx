import Link from "next/link";

import {
  BiChevronDown,
  BiGridAlt,
  BiBook,
  BiAward,
  BiBarChart,
  BiUser,
  BiFile,
  BiShield,
  BiTargetLock,
} from "react-icons/bi";

export default async function DesktopMenu({ profile }) {
  if (!profile) return null;

  return (
    <div className="hidden md:flex items-center justify-end w-full overflow-visible">
      {/* Left Menu */}
      <div className="flex items-center gap-2  px-3 py-1  ">
        {/* Access */}
        <Link
          href="/access"
          className="rounded-sm px-2 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active"
        >
          Access
        </Link>

        {/* Equity */}
        <Link
          href="/equity"
          className="rounded-sm px-2 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active"
        >
          Equity
        </Link>

        {/* Quality Dropdown */}
        <div className="relative group z-[9999]">
          <button className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active cursor-pointer">
            <BiBarChart size={18} />
            Quality
            <BiChevronDown size={18} />
          </button>

          <div className="invisible absolute left-0 top-[120%] z-[9999] w-[26rem] translate-y-2 rounded-sm border border-lis-panel-border bg-white p-1 opacity-0  transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-1">
            <Link
              href="/mps"
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBarChart size={18} />
              MPS
            </Link>

            <Link
              href="/mps-term"
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBarChart size={18} />
              MPS Term
            </Link>

            <Link
              href="/gpa"
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiAward size={18} />
              GPA
            </Link>

            <Link
              href="/gpa-term"
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiAward size={18} />
              GPA Term
            </Link>

            <Link
              href="/llc"
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiTargetLock size={18} />
              LLC
            </Link>

            <Link
              href="/rma"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiGridAlt size={18} />
              RMA
            </Link>

            <Link
              href="/phil-iri"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBook size={18} />
              PHIL-IRI
            </Link>

            <Link
              href="/crla"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBook size={18} />
              CRLA
            </Link>

            <Link
              href="/summative-test"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBook size={18} />
              Summative Test
            </Link>

            <Link
              href="/lesson-plan"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiBook size={18} />
              Lesson Plan
            </Link>

            <Link
              href="/school-forms"
              className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
            >
              <BiFile size={18} />
              School Forms
            </Link>
            </div>
          </div>
        </div>

        {/* Other Menus */}
        <Link
          href="/"
          className="max-w-[170px] truncate rounded-sm px-2 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active"
        >
          Resiliency & Well-being
        </Link>

        <Link
          href="/"
          className="max-w-[170px] truncate rounded-sm px-2 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active"
        >
          Enabling Mechanism
        </Link>
      </div>

      {/* Management Dropdown */}
      <div className="relative group z-[9999] ml-2">
        <button className="flex items-center gap-2 rounded-sm border border-lis-panel-border bg-lis-panel-header px-4 py-2 text-sm font-medium text-lis-text transition hover:bg-lis-tab-active cursor-pointer">
          <BiGridAlt size={18} />
          Management
          <BiChevronDown size={18} />
        </button>

        <div className="invisible absolute right-0 top-[120%] z-[9999] w-60 translate-y-2 rounded-sm border border-lis-panel-border bg-white p-1 opacity-0  transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {/* Templates */}
          <Link
            href="/templates"
            className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
          >
            <BiFile size={18} />
            Templates
          </Link>

          {/* Class */}
          <Link
            href="/class"
            className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
          >
            <BiGridAlt size={18} />
            Class
          </Link>

          {/* Users */}
          {profile.role === "admin" && (
            <>
              <Link
                href="/admin-dashboard"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiShield size={18} />
                Admin
              </Link>

              <Link
                href="/users"
                className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-lis-text transition hover:bg-lis-panel-header"
              >
                <BiUser size={18} />
                Users
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
