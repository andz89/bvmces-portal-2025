import React, { useState, useEffect } from "react";
import { getLessonPlans } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
const SearchBar = ({ termParams, weekParams }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(termParams ?? 1);
  const [week, setWeek] = useState(weekParams ?? 1);
  useEffect(() => {
    setTerm(termParams ?? 1);
    setWeek(weekParams ?? 1);
  }, [termParams, weekParams]);
  const handleSearch = () => {
    const params = new URLSearchParams();

    params.set("term", String(term));
    params.set("week", String(week));

    startTransition(() => {
      router.push(`/lesson-plan?${params.toString()}`);
    });
  };

  return (
    <div className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-wrap gap-4 items-end">
      {/* Term */}
      <div className="min-w-40">
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          Term
        </label>

        <select
          name="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5"
        >
          <option value="1">Term 1</option>
          <option value="2">Term 2</option>
          <option value="3">Term 3</option>
        </select>
      </div>

      {/* Week */}
      <div className="min-w-36">
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          Week
        </label>

        <select
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          name="week"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        disabled={isPending}
        className="rounded-xl bg-slate-600 px-6 py-2.5 font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
