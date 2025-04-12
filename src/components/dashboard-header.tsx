"use client";

import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function UnifiedHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Excluded routes list
  const excludedRoutes = ["/login", "/register", "/forgot-password"];

  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  // Handle scroll event to make header more compact on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed height placeholder to prevent content from jumping */}
      <div className="h-16" />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 bg-white border-b z-50 h-16",
          "transform transition-all duration-200",
          isScrolled && "shadow-sm"
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-x-4">
              <div className="h-8 w-32 relative">
                <Image
                  src="/logo.jpg"
                  alt="Kapsam Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden md:block text-sm text-gray-500 font-medium pl-4 border-l">
                {pathname.split("/").map((part, index) => {
                  if (index === 0 || part === "") return null;
                  return (
                    <span key={index} className="capitalize">
                      {index > 1 && " / "}
                      {part.replace(/-/g, " ")}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <div className="flex items-center mr-2">
                <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.username ?? user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.toLowerCase()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => logout()}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 transition-colors group"
              >
                <LogOut className="h-4 w-4 sm:mr-2 group-hover:text-red-600" />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
