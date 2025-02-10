import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ProtectedRoute } from "@/providers/protected-route";
import { Toaster } from "sonner";
import { UnifiedHeader } from "@/components/dashboard-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kapsam ERP",
  description: "Enterprise Resource Planning System",
};

// For a dynamic locale, you could accept params in your layout.
// For now, it just sets a default language.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[#f8f9fc]">
          <div className="flex-1 space-y-4 container mx-auto pt-24 pb-8">
            <QueryProvider>
              <ProtectedRoute>
                <UnifiedHeader />
                {children}
              </ProtectedRoute>
            </QueryProvider>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
