// app/page.jsx
import Link from "next/link";
import { checkRole } from "../utils/lib/checkRole";
import DashboardHomePage from "./components/DashboardHomePage";
import Image from "next/image";

export default async function Page() {
  const role = await checkRole();
  console.log(role);
  return (
    <>
      {role !== null ? (
        <DashboardHomePage />
      ) : (
        <main className="   flex items-center justify-center  mx-5 mt-[40px]">
          <div className="max-w-xl w-full  p-8 rounded-lg shadow-md text-center bg-gray-100">
            <Image
              src="/bvmces-logo.png"
              alt="My photo"
              width={100}
              height={100}
              className="mx-auto"
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
