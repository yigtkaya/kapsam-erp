// Maintanence Modules

"use client";

import { cn } from "@/lib/utils";
import {
  Package,
  Activity,
  Truck,
  Trash2,
  Archive,
  Wrench,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

const salesModules = [
  {
    title: "Makine Bakım Kartları",
    description: "Makine Bakımı",
    icon: CalendarDays,
    href: "/maintanence/machine-maintenance-cards",
    color: "bg-emerald-500",
  },
  {
    title: "Makineler",
    description: "Makinelerin yönetimi",
    icon: Wrench,
    href: "/maintanence/machines",
    color: "bg-purple-500",
  },
];

export function MaintanenceModules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {salesModules.map((module) => (
        <Link
          key={module.title}
          href={module.href}
          className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-start space-x-4">
            <div
              className={cn(
                "p-3 rounded-lg",
                module.color,
                "bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200"
              )}
            >
              <module.icon
                className={cn("h-6 w-6", module.color.replace("bg-", "text-"))}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {module.title}
              </h3>
              <p className="text-sm text-gray-500">{module.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
