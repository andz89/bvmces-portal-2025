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
            duration: 3500,

            className: `
    !bg-white
    !text-neutral-900
    !border
    !border-neutral-200
    !rounded-xl
    !px-4
    !py-3
    !text-sm
    !font-medium
    !shadow-lg
    
  `,

            success: {
              className: `
      !bg-emerald-50
      !text-emerald-900
      !border
      !border-emerald-200
      !rounded-xl
      !px-4
      !py-3
      !text-sm
      !font-medium
      !shadow-lg
 
    `,

              iconTheme: {
                primary: "#059669",
                secondary: "#ECFDF5",
              },
            },

            error: {
              className: `
      !bg-red-50
      !text-red-900
      !border
      !border-red-200
      !rounded-xl
      !px-4
      !py-3
      !text-sm
      !font-medium
      !shadow-lg
      
    `,

              iconTheme: {
                primary: "#DC2626",
                secondary: "#FEF2F2",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
