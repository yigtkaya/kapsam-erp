"use client";

import { cn } from "@/lib/utils";
import {
  Hammer,
  Factory,
  Wrench,
  Gauge,
  PackageSearch,
  BringToFront,
  Barcode,
  ShieldCheck,
  FolderKanban,
  FileSliders,
  Layers,
  Workflow,
  Users,
} from "lucide-react";
import Link from "next/link";

const modules = [
  // {
  //   title: "Tasarım",
  //   description: "Konfigürasyon ve tasarım işlemlerinin takibi",
  //   icon: Hammer,
  //   href: "/design",
  //   color: "bg-blue-500",
  // },
  {
    title: "MKI",
    description: "Konfigürasyon ve tasarım işlemlerinin takibi",
    icon: Hammer,
    href: "/design/MKI",
    color: "bg-blue-500",
  },
  {
    title: "Konfigürasyon Yönetimi",
    description: "Konfigürasyon ve tasarım işlemlerinin takibi",
    icon: FileSliders,
    href: "/design/configuration",
    color: "bg-blue-100",
  },
  {
    title: "Müşteri Teknik Resimleri",
    description: "Müşteri teknik resimlerinin takibi ve yönetimi",
    icon: FolderKanban,
    href: "/design/customer-technical-drawings",
    color: "bg-green-500",
  },
  {
    title: "Ürün Reçeteleri",
    description: "Ürün reçetelerinin takibi ve yönetimi",
    icon: Workflow,
    href: "/production-planning/boms",
    color: "bg-blue-100",
  },
  {
    title: "İş Emirleri",
    description: "İş emirlerinin takibi ve yönetimi",
    icon: Layers,
    href: "/production-planning/work-orders",
    color: "bg-green-500",
  },
  {
    title: "Üretim Raporları",
    description: "Üretim raporlarının takibi ve yönetimi",
    icon: Hammer,
    href: "/production/production-reports",
    color: "bg-blue-500",
  },
  // {
  //   title: "Üretim Planlama",
  //   description: "Üretim süreçlerinin takibi ve yönetimi",
  //   icon: FolderKanban,
  //   href: "/production-planning",
  //   color: "bg-green-500",
  // },
  {
    title: "Bakım",
    description: "Tezgahların bakım zamanlarının takibi",
    icon: Wrench,
    href: "/maintanence",
    color: "bg-purple-500",
    backgroundColor: "bg-blue-100",
  },
  {
    title: "Satış",
    description: "Müşteri siparişlerinin takibi ve yönetimi",
    icon: BringToFront,
    href: "/sales",
    color: "bg-red-500",
    backgroundColor: "bg-blue-100",
  },
  {
    title: "Kalite Yönetim Sistemi",
    description: "Ölçüm cihazlarının kalibrasyon takibi",
    icon: Gauge,
    href: "/quality-management",
    color: "bg-yellow-500",
    backgroundColor: "bg-blue-100",
  },
  {
    title: "Satın Alma",
    description: "Satın alma işlemlerinin takibi",
    icon: Barcode,
    href: "/purchasing",
    color: "bg-yellow-500",
    backgroundColor: "bg-blue-100",
  },
  // {
  //   title: "Kalite Kontrol",
  //   description: "Ölçüm cihazlarının kalibrasyon takibi",
  //   icon: ShieldCheck,
  //   href: "/quality-control",
  //   color: "bg-yellow-500",
  // },
  // {
  //   title: "Üretim",
  //   description: "Üretim raporları ve Takımhane",
  //   icon: Factory,
  //   href: "/production",
  //   color: "bg-gray-500",
  // },
  {
    title: "Girdi Kontrol",
    description: "Konfigürasyon ve tasarım işlemlerinin takibi",
    icon: Hammer,
    href: "/design",
    color: "bg-blue-500",
  },
  {
    title: "Proses Kontrol",
    description: "Üretim süreçlerinin takibi ve yönetimi",
    icon: FolderKanban,
    href: "/production",
    color: "bg-green-500",
  },
  {
    title: "Operasyon Teknik Resimleri",
    description: "Tezgahların bakım zamanlarının takibi",
    icon: Wrench,
    href: "/maintanence",
    color: "bg-purple-500",
  },
  {
    title: "Son Kontrol",
    description: "Müşteri siparişlerinin takibi ve yönetimi",
    icon: BringToFront,
    href: "/sales",
    color: "bg-red-500",
  },
  {
    title: "FAI",
    description: "Ölçüm cihazlarının kalibrasyon takibi",
    icon: Gauge,
    href: "/quality/documentation",
    color: "bg-yellow-500",
  },
  {
    title: "Kalibrasyon",
    description: "Satın alma işlemlerinin takibi",
    icon: Barcode,
    href: "/purchasing",
    color: "bg-yellow-500",
  },
  // {
  //   title: "Karantina Listesi",
  //   description: "Ölçüm cihazlarının kalibrasyon takibi",
  //   icon: ShieldCheck,
  //   href: "/quality/documentation",
  //   color: "bg-yellow-500",
  // },
  {
    title: "Depo",
    description: "Hammadde, yarımamul, ürün ve montaj stok takibi",
    icon: PackageSearch,
    href: "/warehouse",
    color: "bg-gray-500",
    backgroundColor: "bg-blue-100",
  },
  {
    title: "Kullanıcı Yönetimi",
    description: "Kullanıcı hesaplarının yönetimi ve izinleri",
    icon: Users,
    href: "/admin/users",
    color: "bg-indigo-500",
    backgroundColor: "bg-blue-100",
  },
];

export function DashboardModules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <Link
          key={module.title}
          href={module.href}
          className={cn(
            "group rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1",
            module.backgroundColor || "bg-white"
          )}
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
