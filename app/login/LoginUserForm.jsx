"use client";
import { React } from "react";
import { useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { login } from "../auth/actions";
const LoginUserForm = () => {
  const [error, setError] = useState("");
  const handleSignUpFormData = async (formData) => {
    const msg = await login(formData);

    setError(msg);
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-[340px] mx-auto   flex flex-col border border-neutral-500 rounded-md  p-4 items-center justify-center    shadow-sm">
        <div className="w-full">
          <Link href="/">
            <div className="bg-blue-900 px-3 py-1 text-white rounded-sm inline-block">
              Back
            </div>
          </Link>
        </div>

        <div>
          <Image
            src="/bvmces-logo.png"
            alt="My photo"
            className="mx-auto m-0 p-0"
            width={100}
            height={100}
          />
          <h3 className="text-2xl mb-5 -mt-3 text-center text-blue-900">
            Etraced 2025-2026
          </h3>
        </div>

        <form className="   flex flex-col gap-2 w-full">
          <label
            htmlFor="email"
            className="block  text-sm font-medium text-heading"
          >
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@flowbite.com"
            required
            className="border-1 border-neutral-500 w-full p-2 rounded-lg focus:outline focus:outline-gray-400"
          />

          <div className="mb-3">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Your password
            </label>
            <input
              placeholder="••••••••"
              required
              type="password"
              id="password"
              name="password"
              className="border-1 border-neutral-500 w-full p-2 rounded-lg focus:outline focus:outline-gray-400"
            />
          </div>

          <p className="text-sm text-rose-500 text-center">
            {error ? error : ""}
          </p>

          <div>
            <button
              formAction={handleSignUpFormData}
              className=" bg-slate-800 text-white font-medium rounded shadow-sm p-2 w-full  cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUserForm;
