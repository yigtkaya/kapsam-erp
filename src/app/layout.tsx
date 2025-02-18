"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ProtectedRoute } from "@/providers/protected-route";
import { Toaster } from "sonner";
import { UnifiedHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// For a dynamic locale, you could accept params in your layout.
// For now, it just sets a default language.
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8f9fc] min-h-screen`}
      >
        <QueryProvider>
          <ProtectedRoute>
            <div className="flex w-full">
              <Sidebar className="hidden lg:flex" />
              <div className="flex-1 lg:pl-16">
                <UnifiedHeader />
                <main className="pt-24 px-8 pb-8">{children}</main>
              </div>
            </div>
          </ProtectedRoute>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
