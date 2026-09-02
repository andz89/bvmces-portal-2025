import React from "react";
import Link from "next/link";
const Maintenance = () => {
  const pages = [
    { label: "Access", href: "/access" },
    { label: "GPA", href: "/gpa" },
    { label: "MPS", href: "/mps" },
    { label: "Class", href: "/class" },
    { label: "SELG", href: "/selg" },
    { label: "CRLA", href: "/crla" },
    { label: "RMA", href: "/rma" },
    { label: "Phil-IRI", href: "/phil-iri" },
  ];

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-sm border border-lis-panel-border bg-white p-6 ">
        <h2 className="mb-2 text-xl font-semibold text-lis-text">
          Coming Soon
        </h2>

        <p className="mb-6 text-sm text-lis-muted">
          We’re still working on this page. Some content will be available soon.
        </p>

        <div>
          <p className="mb-3 text-sm font-medium text-lis-text">
            Available pages you can access now:
          </p>

          <ul className="grid grid-cols-2 gap-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  target="blank"
                  className="block rounded-lg border border-lis-panel-border bg-lis-panel-header px-4 py-2 text-sm text-lis-text transition hover:border-lis-panel-border hover:bg-lis-panel-header hover:text-lis-text focus:outline-none focus:ring-2 focus:ring-lis-primary"
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
