"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/api/utils";
import { useAuth } from "@/hooks/use-auth";

export function UnifiedHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // List the routes where the header should NOT display.
  const excludedRoutes = ["/login", "/register", "/forgot-password"];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 bg-white border-b transition-all duration-300 z-50 translate-y-0"
      )}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="h-8 relative w-32">
              <Image
                src="/logo.jpg"
                alt="Kapsam Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <span className="text-sm text-gray-600">
              {user?.username ?? user?.email}{" "}
              <span className="text-gray-400">({user?.role})</span>
            </span>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600 transition-colors group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
      />
    </header>
  );
}
