"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { login } from "./actions";

import {
  BiArrowBack,
  BiEnvelope,
  BiLockAlt,
  BiLogIn,
  BiShieldQuarter,
} from "react-icons/bi";

const LoginUserForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUpFormData = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const msg = await login(formData);

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-lis-bg">
      {/* Left Side */}
      <div className="relative hidden w-1/2 flex-col overflow-hidden bg-lis-primary p-12 text-white lg:flex">
        {/* Glow */}
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 " />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/10 " />

        {/* Top */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ">
            <BiShieldQuarter size={18} />
            School Management System
          </div>

          <h1 className="mt-8 max-w-md text-5xl font-bold leading-tight">
            Welcome to Etraced Portal
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80">
            Manage academic reports, enrollment records, templates, and school
            performance analytics in one secure platform.
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10 mt-20">
          <div className="rounded-sm border border-white/10 bg-white/10 p-6 ">
            <p className="text-sm text-white/80">Academic Year</p>

            <h2 className="mt-2 text-4xl font-bold">2026–2027</h2>

            <p className="mt-3 text-sm text-white/80">
              Secure • Fast • Modern Portal Experience
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md overflow-hidden rounded-sm border border-lis-panel-border bg-white shadow-sm">
          {/* Mobile Top */}
          <div className="relative overflow-hidden bg-lis-primary px-8 py-10 text-white lg:hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 " />

            <div className="relative z-10 flex flex-col items-center">
              <div className="rounded-sm bg-white/10 p-4 ">
                <Image
                  src="/bvmces-logo.png"
                  alt="School Logo"
                  width={85}
                  height={85}
                  className="object-contain"
                />
              </div>

              <h1 className="mt-5 text-3xl font-bold">Etraced</h1>

              <p className="mt-2 text-sm text-white/80">
                Academic Portal 2025–2026
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Back */}
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 rounded-sm border border-lis-panel-border bg-white px-4 py-2 text-sm text-lis-muted transition hover:bg-lis-panel-header"
            >
              <BiArrowBack size={18} />
              Back
            </Link>

            {/* Desktop Logo */}
            <div className="hidden lg:flex flex-col items-center">
              <div className="rounded-sm bg-lis-panel-header p-4">
                <Image
                  src="/bvmces-logo.png"
                  alt="School Logo"
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-lis-heading">Sign In</h2>

              <p className="mt-2 text-sm text-lis-muted">
                Access your academic dashboard
              </p>
            </div>

            {/* Mobile Title */}
            <div className="lg:hidden">
              <h2 className="text-2xl font-bold text-lis-heading">Welcome Back</h2>

              <p className="mt-1 text-sm text-lis-muted">Sign in to continue</p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-lis-muted"
                >
                  Email Address
                </label>

                <div className="relative">
                  <BiEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lis-muted"
                    size={20}
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-sm border border-lis-panel-border bg-lis-panel-header py-3 pl-12 pr-4 text-lis-text placeholder:text-lis-muted outline-none transition focus:border-lis-primary focus:bg-white focus:ring-4 focus:ring-lis-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-lis-muted"
                >
                  Password
                </label>

                <div className="relative">
                  <BiLockAlt
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lis-muted"
                    size={20}
                  />

                  <input
                    placeholder="••••••••"
                    required
                    type="password"
                    id="password"
                    name="password"
                    className="w-full rounded-sm border border-lis-panel-border bg-lis-panel-header py-3 pl-12 pr-4 text-lis-text placeholder:text-lis-muted outline-none transition focus:border-lis-primary focus:bg-white focus:ring-4 focus:ring-lis-primary/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-sm border border-lis-danger-border bg-lis-danger-bg px-4 py-3 text-sm text-lis-danger-text">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                formAction={handleSignUpFormData}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-lis-primary px-5 py-3 font-medium text-white transition hover:bg-lis-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <BiLogIn size={22} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUserForm;
