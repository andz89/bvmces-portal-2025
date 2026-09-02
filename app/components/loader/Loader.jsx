import React from "react";

const Loader = ({ message }) => {
  return (
    <div className="flex items-center justify-center bg-white/0 gap-2">
      <div
        className="h-8 w-8 rounded-full border-4 border-lis-panel-border border-t-lis-primary animate-spin"
        role="status"
        aria-label="Loading"
      />
      {/* Message */}
      {message && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-lis-text">
            Processing Request
          </span>

          <span className="text-sm text-lis-muted">{message}</span>
        </div>
      )}
    </div>
  );
};

export default Loader;
