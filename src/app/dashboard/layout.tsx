"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user as unknown as User} />
      <div className="flex-1 space-y-4 container mx-auto pt-24 pb-8">
        {children}
      </div>
    </div>
  );
}
