"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/types/auth";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

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
            <form action={handleLogout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 transition-colors group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600" />
                Çıkış Yap
              </Button>
            </form>
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
