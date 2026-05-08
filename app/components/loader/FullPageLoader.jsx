import { DotsLoader } from "./DotsLoader";
import Loader from "./Loader";
import React from "react";

const FullPageLoader = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 dark:bg-zinc-900/70  ">
      <Loader message={message} />
    </div>
  );
};

export default FullPageLoader;
