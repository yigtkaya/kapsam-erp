"use client";

import { cn } from "@/api/utils";
import {
  Package,
  Activity,
  Truck,
  Trash2,
  Archive,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const salesModules = [
  {
    title: "Hammadde",
    description: "Hammadde depo yönetimi",
    icon: Package,
    href: "/warehouse/raw-materials",
    color: "bg-emerald-500",
  },
  {
    title: "Proses",
    description: "Proses depo yönetimi",
    icon: Activity,
    href: "/warehouse/process",
    color: "bg-indigo-500",
  },
  {
    title: "Mamül Depo",
    description: "Mamül depo ve sevkiyat yönetimi",
    icon: Truck,
    href: "/warehouse/finished-products",
    color: "bg-blue-500",
  },
  {
    title: "Hurda",
    description: "Hurda depo yönetimi",
    icon: Trash2,
    href: "/warehouse/scrap",
    color: "bg-red-500",
  },
  {
    title: "Karantina",
    description: "Karantina depo yönetimi",
    icon: Archive,
    href: "/warehouse/quarantine",
    color: "bg-amber-500",
  },
  {
    title: "Takımhane",
    description: "Takımhane yönetimi",
    icon: Wrench,
    href: "/warehouse/tooling",
    color: "bg-purple-500",
  },
];

export function WarehouseModules() {
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
