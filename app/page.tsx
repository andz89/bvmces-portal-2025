// app/page.jsx
import Link from "next/link";
import { checkRole } from "../utils/lib/checkRole";
import DashboardHomePage from "./components/DashboardHomePage";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  BiBarChartAlt2,
  BiBookOpen,
  BiShieldQuarter,
  BiLogIn,
} from "react-icons/bi";

export default async function Page() {
  const role = await checkRole();
  if (role) {
    redirect("/access");
  }
  return (
    <>
      {role !== null ? (
        <DashboardHomePage />
      ) : (
        <main className="relative min-h-screen overflow-hidden bg-lis-bg">
          {/* Content */}
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 lg:flex-row lg:gap-16">
            {/* Left Side */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-lis-panel-border bg-white px-4 py-2 text-sm text-lis-muted ">
                <BiShieldQuarter size={18} className="text-lis-primary" />
                B. Vasquez MCES Academic Portal
              </div>

              <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-lis-text md:text-6xl">
                Etraced
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-lis-muted">
                A modern school management portal for tracking academic
                performance, reports, enrollment data, and educational resources
                in one centralized platform.
              </p>

              {/* Features */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-sm border border-lis-panel-border bg-white p-5 ">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-lis-panel-header text-lis-primary">
                    <BiBarChartAlt2 size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-lis-heading">
                    Analytics
                  </h3>

                  <p className="mt-2 text-sm text-lis-muted">
                    Track GPA, MPS, and school performance reports.
                  </p>
                </div>

                <div className="rounded-sm border border-lis-panel-border bg-white p-5 ">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-lis-panel-header text-lis-primary">
                    <BiBookOpen size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-lis-heading">Reports</h3>

                  <p className="mt-2 text-sm text-lis-muted">
                    Access organized academic files and templates.
                  </p>
                </div>

                <div className="rounded-sm border border-lis-panel-border bg-white p-5 ">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-lis-panel-header text-lis-success">
                    <BiShieldQuarter size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-lis-heading">Secure</h3>

                  <p className="mt-2 text-sm text-lis-muted">
                    Protected access for school personnel and admins.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Card */}
            <div className="mt-14 w-full max-w-md lg:mt-0">
              <div className="overflow-hidden rounded-sm border border-lis-panel-border bg-white shadow-sm">
                {/* Top */}
                <div className="relative overflow-hidden bg-lis-primary px-8 py-10 text-center text-white">
                  <div className="relative z-10">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-sm bg-white/10 ">
                      <Image
                        src="/bvmces-logo.png"
                        alt="School Logo"
                        width={90}
                        height={90}
                        className="object-contain"
                      />
                    </div>

                    <h2 className="mt-6 text-3xl font-bold">Welcome</h2>

                    <p className="mt-2 text-sm text-white/80">
                      Academic Portal 2026–2027
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="p-8">
                  <p className="text-center text-sm leading-relaxed text-lis-muted">
                    Access the portal to manage reports, classroom performance,
                    school records, and educational resources.
                  </p>

                  <Link
                    href="/login"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-lis-primary px-5 py-4 text-lg font-semibold text-white transition hover:bg-lis-primary-hover"
                  >
                    <BiLogIn size={24} />
                    Go to Login
                  </Link>

                  <p className="mt-6 text-center text-xs text-lis-muted">
                    B. Vasquez Memorial Central Elementary School
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
