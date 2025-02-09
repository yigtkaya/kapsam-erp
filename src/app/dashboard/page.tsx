"use client";

// create a dashboard page using dashboard modules, use name, as a title. Hoşgeldiniz, {name}

import { useAuth } from "@/providers/auth-provider";
import { DashboardModules } from "./dashboard-modules";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Hoşgeldiniz,{" "}
          <span className="text-blue-600">{user?.username || user?.email}</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Kapsam ERP sistemine hoş geldiniz. Aşağıdaki modüllerden birini
          seçerek başlayabilirsiniz.
        </p>
      </div>
      <DashboardModules />
    </div>
  );
}
