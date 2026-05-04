"use client";

import React, { useState, useEffect } from "react";

const Page = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctPassword = process.env.NEXT_PUBLIC_ELECTION_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Save previous values
    const prevHtmlOverflowX = html.style.overflowX;

    const prevBodyOverflowX = body.style.overflowX;

    // Apply only on this page
    html.style.overflowX = "hidden";

    body.style.overflowX = "hidden";

    return () => {
      // Restore when leaving page
      html.style.overflowX = prevHtmlOverflowX;

      body.style.overflowX = prevBodyOverflowX;
    };
  }, []);

  if (!authorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/90 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-center mb-4">
            School Election Access
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Please enter the access password to continue.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter password"
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Enter Voting Page
          </button>
        </form>
      </div>
    );
  }

  // ✅ AUTHORIZED VIEW (your original page)
  return (
    <div
      className="h-screen w-screen bg-slate-100 overflow-x-hidden"
      style={{ overflow: "hidden" }}
    >
      <div
        className="h-full w-full bg-white flex flex-col overflow-x-hidden"
        style={{ overflow: "hidden" }}
      >
        {/* Iframe */}
        <div className="flex-1 overflow-x-hidden">
          <iframe
            src="https://forms.office.com/Pages/ResponsePage.aspx?id=gKvjQCQgo0W_dnoHYaJNKfbIZdGvPrZNsKXGO7kLgptURERKNFlSVjlSS0FWNVA5WkY0WFJaRlFNSy4u&embed=true"
            className="  w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
