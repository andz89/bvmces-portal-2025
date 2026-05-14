"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { login } from "../auth/actions";

import {
  BiArrowBack,
  BiEnvelope,
  BiLockAlt,
  BiLogIn,
  BiShieldQuarter,
} from "react-icons/bi";

const LoginUserForm = () => {
  const [error, setError] = useState("");

  const handleSignUpFormData = async (formData) => {
    const msg = await login(formData);

    setError(msg);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Left Side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-12 text-white lg:flex">
        {/* Glow */}
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

        {/* Top */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <BiShieldQuarter size={18} />
            School Management System
          </div>

          <h1 className="mt-8 max-w-md text-5xl font-bold leading-tight">
            Welcome to Etraced Portal
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-blue-100">
            Manage academic reports, enrollment records, templates, and school
            performance analytics in one secure platform.
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-sm text-blue-100">Academic Year</p>

            <h2 className="mt-2 text-4xl font-bold">2025–2026</h2>

            <p className="mt-3 text-sm text-blue-100">
              Secure • Fast • Modern Portal Experience
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          {/* Mobile Top */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-10 text-white lg:hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <Image
                  src="/bvmces-logo.png"
                  alt="School Logo"
                  width={85}
                  height={85}
                  className="object-contain"
                />
              </div>

              <h1 className="mt-5 text-3xl font-bold">Etraced</h1>

              <p className="mt-2 text-sm text-blue-100">
                Academic Portal 2025–2026
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Back */}
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <BiArrowBack size={18} />
              Back
            </Link>

            {/* Desktop Logo */}
            <div className="hidden lg:flex flex-col items-center">
              <div className="rounded-3xl bg-white/5 p-4">
                <Image
                  src="/bvmces-logo.png"
                  alt="School Logo"
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-white">Sign In</h2>

              <p className="mt-2 text-sm text-slate-400">
                Access your academic dashboard
              </p>
            </div>

            {/* Mobile Title */}
            <div className="lg:hidden">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>

              <p className="mt-1 text-sm text-slate-300">Sign in to continue</p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email Address
                </label>

                <div className="relative">
                  <BiEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <BiLockAlt
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    placeholder="••••••••"
                    required
                    type="password"
                    id="password"
                    name="password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                formAction={handleSignUpFormData}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl cursor-pointer"
              >
                <BiLogIn size={22} />
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUserForm;
