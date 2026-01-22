"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import FullPageLoader from "../../components/loader/FullPageLoader";

export default function SchoolYearSelect({ currentYear }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);

    startTransition(() => {
      router.push(`?${params.toString()}`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1 w-[300px]">
      {isPending && <FullPageLoader />}

      <select
        value={currentYear}
        onChange={handleChange}
        className="border border-slate-300 py-3 px-3"
      >
        <option value="2024-2025">2024-2025</option>
        <option value="2025-2026">2025-2026</option>
      </select>
    </div>
  );
}
