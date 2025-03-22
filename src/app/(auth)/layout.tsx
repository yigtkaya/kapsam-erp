"use client";

import { QueryProvider } from "@/providers/query-provider";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Create a component for auth content that uses the useAuth hook
function AuthContent({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  // Use try-catch to handle any errors in useAuth
  let authData;
  try {
    authData = useAuth();
  } catch (err) {
    console.error("Error in useAuth:", err);
    setError(err instanceof Error ? err : new Error(String(err)));
    authData = { isAuthenticated: false, isLoading: false };
  }

  const { isAuthenticated, isLoading } = authData;
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContent mount - Auth state:", {
      isAuthenticated,
      isLoading,
    });

    if (!isLoading && isAuthenticated) {
      console.log("Redirecting to dashboard from auth layout");
      router.push("/dashboard");
    }

    return () => {
      console.log("AuthContent unmount");
    };
  }, [isAuthenticated, isLoading, router]);

  // If we had an error in useAuth, display it
  if (error) {
    return (
      <div className="flex min-h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="text-red-500 font-semibold mb-2">
          Error in Auth Component:
        </div>
        <div className="text-sm bg-red-50 p-3 rounded border border-red-200 max-w-md">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.jpg"
            alt="Kapsam ERP"
            width={180}
            height={72}
            className="h-auto w-auto mb-6"
            priority
          />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Auth Layout render");

  useEffect(() => {
    console.log("Auth Layout mounted");
    return () => console.log("Auth Layout unmounted");
  }, []);

  return (
    <QueryProvider>
      <AuthContent>{children}</AuthContent>
    </QueryProvider>
  );
}
