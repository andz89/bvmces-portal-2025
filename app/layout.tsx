import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/header/header";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BVMCES",
  description: "BVMCES Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden `}
      >
        <Navbar />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,

            className: `
        !bg-gradient-to-r
        !from-emerald-600
        !to-green-600
        !text-white
        !rounded-2xl
        !px-6
        !py-5
        !text-[16px]
        !font-semibold
        !shadow-2xl
        !min-w-[340px]
        !border
        !border-white/10
      `,

            success: {
              iconTheme: {
                primary: "#ffffff",
                secondary: "#16a34a",
              },
            },

            error: {
              className: `
          !bg-gradient-to-r
          !from-red-500
          !to-rose-600
          !text-white
          !rounded-2xl
          !px-6
          !py-5
          !text-[16px]
          !font-semibold
          !shadow-2xl
          !min-w-[340px]
        `,

              iconTheme: {
                primary: "#ffffff",
                secondary: "#ef4444",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
