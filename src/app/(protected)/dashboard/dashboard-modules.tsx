"use client";

import { cn } from "@/lib/utils";
import {
  Hammer,
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
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/core";

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
    roles: ["ADMIN"],
  },
  {
    title: "Konfigürasyon Yönetimi",
    description: "Konfigürasyon ve tasarım işlemlerinin takibi",
    icon: FileSliders,
    href: "/design/configuration",
    color: "bg-blue-100",
    roles: ["ADMIN"],
  },
  {
    title: "Müşteri Teknik Resimleri",
    description: "Müşteri teknik resimlerinin takibi ve yönetimi",
    icon: FolderKanban,
    href: "/design/customer-technical-drawings",
    color: "bg-green-500",
    roles: ["ADMIN"],
  },
  // {
  //   title: "Manufacturing (CREATION)",
  //   description: "Üretim süreçlerinin takibi ve yönetimi",
  //   icon: FolderKanban,
  //   href: "/manufacturing",
  //   color: "bg-green-500",
  //   roles: ["ADMIN"],
  // },
  {
    title: "İş Akış Kartları",
    description: "İş akış kartlarının takibi ve yönetimi",
    icon: FolderKanban,
    href: "/workflow-cards",
    color: "bg-green-500",
    roles: ["ADMIN"],
  },
  {
    title: "Bom Listeleri",
    description: "Bom listelerinin takibi ve yönetimi",
    icon: Workflow,
    href: "/bom-lists",
    color: "bg-blue-100",
    roles: ["ADMIN"],
  },
  {
    title: "Stok Tanıtım Kartları",
    description: "Stok tanıtım kartlarının takibi ve yönetimi",
    icon: Workflow,
    href: "/stock-cards",
    color: "bg-blue-100",
    roles: ["ADMIN"],
  },
  {
    title: "Demirbaş Tanıtım Kartları",
    description: "Demirbaş tanıtım kartlarının takibi ve yönetimi",
    icon: FileSliders,
    href: "/fixed-assets",
    color: "bg-blue-100",
    roles: ["ADMIN"],
  },
  // {
  //   title: "Ürün Reçeteleri",
  //   description: "Ürün reçetelerinin takibi ve yönetimi",
  //   icon: Workflow,
  //   href: "/boms",
  //   color: "bg-blue-100",
  //   roles: ["ADMIN"],
  // },
  {
    title: "İş Emirleri",
    description: "İş emirlerinin takibi ve yönetimi",
    icon: Layers,
    href: "/production-planning/work-orders",
    color: "bg-green-500",
    roles: ["ADMIN"],
  },
  {
    title: "Üretim Raporları",
    description: "Üretim raporlarının takibi ve yönetimi",
    icon: Hammer,
    href: "/production",
    color: "bg-blue-500",
    roles: ["ADMIN"],
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
    roles: ["ADMIN"],
  },
  {
    title: "Satış",
    description: "Müşteri siparişlerinin takibi ve yönetimi",
    icon: BringToFront,
    href: "/sales",
    color: "bg-red-500",
    backgroundColor: "bg-blue-100",
    roles: ["ADMIN"],
  },
  {
    title: "Kalite Yönetim Sistemi",
    description: "Ölçüm cihazlarının kalibrasyon takibi",
    icon: Gauge,
    href: "/quality-management",
    color: "bg-yellow-500",
    backgroundColor: "bg-blue-100",
    roles: ["ADMIN"],
  },
  {
    title: "Satın Alma",
    description: "Satın alma işlemlerinin takibi",
    icon: Barcode,
    href: "/purchasing",
    color: "bg-yellow-500",
    backgroundColor: "bg-blue-100",
    roles: ["ADMIN"],
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
    roles: ["ADMIN"],
  },
  {
    title: "Proses Kontrol",
    description: "Üretim süreçlerinin takibi ve yönetimi",
    icon: FolderKanban,
    href: "/production",
    color: "bg-green-500",
    roles: ["ADMIN"],
  },
  {
    title: "Operasyon Teknik Resimleri",
    description: "Tezgahların bakım zamanlarının takibi",
    icon: Wrench,
    href: "/maintanence",
    color: "bg-purple-500",
    roles: ["ADMIN"],
  },
  {
    title: "Son Kontrol",
    description: "Müşteri siparişlerinin takibi ve yönetimi",
    icon: BringToFront,
    href: "/sales",
    color: "bg-red-500",
    roles: ["ADMIN"],
  },
  {
    title: "FAI",
    description: "İlk parça üretimi",
    icon: Gauge,
    href: "/quality/documentation",
    color: "bg-yellow-500",
    roles: ["ADMIN"],
  },
  {
    title: "Kalibrasyon",
    description: "Ölçüm cihazlarının kalibrasyon takibi",
    icon: Barcode,
    href: "/purchasing",
    color: "bg-yellow-500",
    roles: ["ADMIN"],
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
    roles: ["ADMIN", "ENGINEER"],
  },
  {
    title: "Kullanıcı Yönetimi",
    description: "Kullanıcı hesaplarının yönetimi ve izinleri",
    icon: Users,
    href: "/admin/users",
    color: "bg-indigo-500",
    backgroundColor: "bg-blue-100",
    roles: ["ADMIN"],
  },
];

export function DashboardModules() {
  const { user } = useAuth();
  const userRole = user?.role as UserRole;

  console.log("DashboardModules - User:", user);
  console.log("DashboardModules - User Role:", userRole, typeof userRole);

  // Log all the available modules and their required roles before filtering
  console.log(
    "DashboardModules - Available modules:",
    modules.map((m) => ({
      title: m.title,
      roles: m.roles,
    }))
  );

  const filteredModules = modules.filter((module) =>
    hasModuleAccess(userRole, module.roles as UserRole[])
  );

  console.log(
    "DashboardModules - Filtered Modules Count:",
    filteredModules.length
  );
  console.log("DashboardModules - Filtered Modules:", filteredModules);

  // If no modules are available for this user
  if (filteredModules.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            Erişilebilir modül bulunamadı
          </h3>
          <p className="text-gray-600 mb-6">
            Hesabınıza atanmış herhangi bir modül bulunmamaktadır. Sistem
            yöneticinizle iletişime geçin.
          </p>
          <div className="text-sm text-gray-500">
            Kullanıcı: {user?.username || "Unknown"}
            <br />
            Rol: {userRole || "Rol bulunamadı"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredModules.map((module) => (
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

export const hasModuleAccess = (
  userRole: UserRole,
  moduleRoles?: UserRole[]
) => {
  console.log("Checking access - User Role:", userRole);
  console.log("Checking access - Module Roles:", moduleRoles);

  // If the user role is undefined/null, deny access
  if (!userRole) {
    console.log("Access denied - No user role");
    return false;
  }

  // Check for string equality with "ADMIN" in case the role is coming as a string and not a proper enum
  if (userRole === "ADMIN" || userRole.toUpperCase() === "ADMIN") {
    console.log("Access granted - User is ADMIN");
    return true;
  }

  // If module has no roles specified or is empty array, nobody has access
  if (!moduleRoles || moduleRoles.length === 0) {
    console.log("Access denied - No module roles specified");
    return false;
  }

  // Check if user's role is in the module roles (case insensitive)
  const normalizedUserRole = userRole.toUpperCase();
  const hasAccess = moduleRoles.some(
    (role) => role.toUpperCase() === normalizedUserRole
  );

  console.log("Access result:", hasAccess);
  return hasAccess;
};
