"use client";

import { QueryProvider } from "@/providers/query-provider";
import { UnifiedHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Suspense, useEffect, useState } from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  // Use try-catch to handle any errors in useAuth
  let authData;
  try {
    authData = useAuth();
  } catch (err) {
    console.error("Error in useAuth in protected layout:", err);
    setError(err instanceof Error ? err : new Error(String(err)));
    authData = { isLoading: false };
  }

  const { isLoading } = authData;

  useEffect(() => {
    console.log("ProtectedContent mount - isLoading:", isLoading);
    return () => {
      console.log("ProtectedContent unmount");
    };
  }, [isLoading]);

  // If we had an error in useAuth, display it
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="text-red-500 font-semibold mb-2">
          Error in Protected Layout:
        </div>
        <div className="text-sm bg-red-50 p-3 rounded border border-red-200 max-w-md">
          {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex w-full">
      <Sidebar className="hidden lg:flex" />
      <div className="flex-1 lg:pl-16">
        <UnifiedHeader />
        <main className="pt-24 px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Protected Layout render");

  useEffect(() => {
    console.log("Protected Layout mounted");
    return () => console.log("Protected Layout unmounted");
  }, []);

  return (
    <QueryProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedContent>{children}</ProtectedContent>
      </Suspense>
    </QueryProvider>
  );
}
