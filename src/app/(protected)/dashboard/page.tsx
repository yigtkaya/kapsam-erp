"use client";

// create a dashboard page using dashboard modules, use name, as a title. Hoşgeldiniz, {name}

import { useAuth } from "@/hooks/use-auth";
import { DashboardModules } from "./dashboard-modules";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  console.log("Dashboard - User:", user);
  console.log("Dashboard - isAuthenticated:", isAuthenticated);

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

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Debug Info:
            </h3>
            <div className="flex items-center mb-2">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  isAuthenticated ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-xs font-medium">
                Authentication Status:{" "}
                {isAuthenticated ? "Authenticated ✅" : "Not Authenticated ❌"}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  user?.role ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-xs font-medium">
                User Role: {user?.role || "No Role Assigned"}{" "}
                {user?.role === "ADMIN" ? "(✅ Admin Access)" : ""}
              </span>
            </div>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(
                {
                  username: user?.username,
                  email: user?.email,
                  role: user?.role,
                  isAuthenticated,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
      <DashboardModules />
    </div>
  );
}
