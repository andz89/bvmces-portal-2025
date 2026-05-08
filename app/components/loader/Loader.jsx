import React from "react";

const Loader = ({ message }) => {
  return (
    <div className="flex items-center justify-center bg-white/0 gap-2">
      <div className="relative h-8 w-8 bg-white/0">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-indigo-500 animate-spin" />
        <div className="absolute inset-1 rounded-full bg-white dark:bg-zinc-900" />
      </div>
      {/* Message */}
      {message && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            Processing Request
          </span>

          <span className="text-sm text-slate-500">{message}</span>
        </div>
      )}
    </div>
  );
};

export default Loader;
