"use client";

import { QueryProvider } from "@/providers/query-provider";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

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
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // If we had an error in useAuth, display it
  if (error) {
    return (
      <div className="flex min-h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="text-red-600 font-semibold mb-2">
          Authentication Error
        </div>
        <div className="text-sm bg-red-50 p-4 rounded-lg border border-red-200 max-w-md">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left panel with image/brand - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700"
        />

        <div className="relative z-10 max-w-md px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo.jpg"
              alt="Kapsam ERP"
              width={180}
              height={72}
              className="h-auto w-auto mx-auto mb-8"
              priority
            />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl font-bold text-white mb-6"
          >
            Kapsam ERP Sistemine Hoş Geldiniz
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-blue-100 text-lg"
          >
            Kurumsal kaynak planlamanızı daha verimli yönetin
          </motion.p>
        </div>

        {/* Background decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-0 left-0 w-full h-64 bg-white/10"
          style={{
            clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
          }}
        />
      </div>

      {/* Right panel with form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile only */}
          <div className="lg:hidden flex justify-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/logo.jpg"
                alt="Kapsam ERP"
                width={130}
                height={52}
                className="h-auto w-auto"
                priority
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100"
          >
            {children}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-xs text-gray-500"
          >
            © {new Date().getFullYear()} Kapsam ERP. Tüm hakları saklıdır.
          </motion.p>
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
  return (
    <QueryProvider>
      <AuthContent>{children}</AuthContent>
    </QueryProvider>
  );
}
