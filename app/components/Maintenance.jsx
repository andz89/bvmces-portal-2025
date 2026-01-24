import React from "react";
import Link from "next/link";
const Maintenance = () => {
  const pages = [
    { label: "Access", href: "/access" },
    { label: "GPA", href: "/gpa" },
    { label: "MPS", href: "/mps" },
    { label: "Class", href: "/class" },
  ];

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Coming Soon
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          We’re still working on this page. Some content will be available soon.
        </p>

        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">
            Available pages you can access now:
          </p>

          <ul className="grid grid-cols-2 gap-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  target="blank"
                  className="block rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
