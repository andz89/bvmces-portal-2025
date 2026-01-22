import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-white/0">
      <div className="relative h-12 w-12 bg-white/0">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-indigo-500 animate-spin" />
        <div className="absolute inset-1 rounded-full bg-white dark:bg-zinc-900" />
      </div>
    </div>
  );
};

export default Loader;
