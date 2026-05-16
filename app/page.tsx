// app/page.jsx
import Link from "next/link";
import { checkRole } from "../utils/lib/checkRole";
import DashboardHomePage from "./components/DashboardHomePage";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import {
  BiBarChartAlt2,
  BiBookOpen,
  BiShieldQuarter,
  BiLogIn,
} from "react-icons/bi";

export default async function Page() {
  const role = await checkRole();

  return (
    <>
      {role !== null ? (
        <DashboardHomePage />
      ) : (
        <main className="relative min-h-screen overflow-hidden bg-slate-950">
          {/* Background Glow */}
          <div className="absolute left-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 lg:flex-row lg:gap-16">
            {/* Left Side */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <BiShieldQuarter size={18} />
                B. Vasquez MCES Academic Portal
              </div>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Etraced
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
                A modern school management portal for tracking academic
                performance, reports, enrollment data, and educational resources
                in one centralized platform.
              </p>

              {/* Features */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
                    <BiBarChartAlt2 size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    Analytics
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Track GPA, MPS, and school performance reports.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                    <BiBookOpen size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-white">Reports</h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Access organized academic files and templates.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                    <BiShieldQuarter size={26} />
                  </div>

                  <h3 className="text-lg font-semibold text-white">Secure</h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Protected access for school personnel and admins.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Card */}
            <div className="mt-14 w-full max-w-md lg:mt-0">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                {/* Top */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-10 text-center text-white">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                      <Image
                        src="/bvmces-logo.png"
                        alt="School Logo"
                        width={90}
                        height={90}
                        className="object-contain"
                      />
                    </div>

                    <h2 className="mt-6 text-3xl font-bold">Welcome</h2>

                    <p className="mt-2 text-sm text-blue-100">
                      Academic Portal 2026–2027
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="p-8">
                  <p className="text-center text-sm leading-relaxed text-slate-300">
                    Access the portal to manage reports, classroom performance,
                    school records, and educational resources.
                  </p>

                  <Link
                    href="/login"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-2xl"
                  >
                    <BiLogIn size={24} />
                    Go to Login
                  </Link>

                  <p className="mt-6 text-center text-xs text-slate-500">
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
