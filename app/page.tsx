// app/page.jsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { checkRole } from "../utils/lib/checkRole";
import DashboardHomePage from "./components/DashboardHomePage";
import Image from "next/image";
export default async function Page() {
  const supabase = await createClient();
  let profile;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in users should not stay on public page
  if (user) {
    profile = await checkRole();
  }

  return (
    <>
      {profile ? (
        <DashboardHomePage />
      ) : (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md text-center">
            <Image
              src="/bvmces-logo.png"
              alt="My photo"
              className="mx-auto"
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-bold mb-4 text-blue-900">Etraced</h1>

            <p className="text-gray-600 mb-6">
              Etraced is a school portal project of B.Vasquez MCES that manages
              school data and provides easy, organized access.
            </p>

            <ul className="text-gray-500 text-sm mb-8 space-y-2">
              <li>• View student classroom performance</li>
              <li>• Tracking of school data</li>
              <li>• Access reports and school projects</li>
            </ul>

            <Link
              href="/login"
              className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Go to Login to continue
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
