"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  onClear,
}) {
  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSearch(search);
  };

  const handleClear = async () => {
    setSearch("");

    if (onClear) {
      await onClear();
    } else {
      await onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <FiSearch
          size={18}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-lis-muted
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            rounded-sm
            border
            border-lis-panel-border
            bg-white
            py-2.5
            pl-10
            pr-10
            text-sm
            outline-none
            transition
            focus:border-black
          "
        />

        {/* Clear Button */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              cursor-pointer
              right-3
              top-1/2
              -translate-y-1/2
              text-lis-muted
              hover:text-black
              transition
            "
          >
            <FiX size={22} />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="
          rounded-sm
          bg-black
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:opacity-90
        "
      >
        Search
      </button>
    </form>
  );
}
