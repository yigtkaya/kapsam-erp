"use client";

import {
  Hammer,
  Wrench,
  Gauge,
  BringToFront,
  Barcode,
  ShieldCheck,
  FolderKanban,
  FileSliders,
  Layers,
  Workflow,
  Users,
  Home,
  Box,
} from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarMobile from "./sidebar-mobile";
import { SidebarItems } from "./types";
import SidebarDesktop, { hasSidebarAccess } from "./sidebar-desktop";
import { UserRole } from "@/types/core";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const pathsToMinimize = ["/login", "/"];
  const { user } = useAuth();

  const sidebarItems: SidebarItems = {
    admin: [
      {
        label: "Anasayfa",
        href: "/",
        icon: Home,
        roles: ["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"],
      },
      {
        label: "Tasarım",
        href: "/design",
        icon: Hammer,
        roles: ["ADMIN"],
        subItems: [
          {
            label: "MKI",
            href: "/design/MKI",
            icon: Hammer,
            roles: ["ADMIN"],
          },
          {
            label: "Konfigürasyon Yönetimi",
            href: "/design/configuration",
            icon: FileSliders,
            roles: ["ADMIN"],
          },
          {
            label: "Müşteri Teknik Resimleri",
            href: "/design/customer-technical-drawings",
            icon: FolderKanban,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Üretim Raporları",
        href: "/production",
        icon: Hammer,
        roles: ["ADMIN"],
      },
      {
        label: "Üretim Planlama",
        href: "/production-planning",
        icon: Layers,
        roles: ["ADMIN"],
        subItems: [
          {
            label: "İş Emirleri",
            href: "/production-planning/work-orders",
            icon: Layers,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "İş Akış Kartları",
        href: "/workflow-cards",
        icon: FolderKanban,
        roles: ["ADMIN"],
      },
      {
        label: "Bom Listeleri",
        href: "/bom-lists",
        icon: Workflow,
        roles: ["ADMIN"],
      },
      {
        label: "Stok Tanıtım Kartları",
        href: "/stock-cards",
        icon: Workflow,
        roles: ["ADMIN"],
      },
      {
        label: "Demirbaş Tanıtım Kartları",
        href: "/fixed-assets",
        icon: FileSliders,
        roles: ["ADMIN"],
      },
      {
        label: "Bakım",
        href: "/maintenance",
        icon: Wrench,
        roles: ["ADMIN"],
      },
      {
        label: "Satış",
        href: "/sales",
        icon: BringToFront,
        roles: ["ADMIN"],
      },
      {
        label: "Kalite Yönetim Sistemi",
        href: "/quality-management",
        icon: Gauge,
        roles: ["ADMIN"],
      },
      {
        label: "Satın Alma",
        href: "/purchasing",
        icon: Barcode,
        roles: ["ADMIN"],
      },
      {
        label: "Kalite Kontrol",
        href: "/quality-control",
        icon: ShieldCheck,
        roles: ["ADMIN"],
        subItems: [
          {
            label: "Girdi Kontrol",
            href: "/design",
            icon: Hammer,
            roles: ["ADMIN"],
          },
          {
            label: "Proses Kontrol",
            href: "/production",
            icon: FolderKanban,
            roles: ["ADMIN"],
          },
          {
            label: "Operasyon Teknik Resimleri",
            href: "/maintenance",
            icon: Wrench,
            roles: ["ADMIN"],
          },
          {
            label: "Son Kontrol",
            href: "/sales",
            icon: BringToFront,
            roles: ["ADMIN"],
          },
          {
            label: "FAI",
            href: "/quality/documentation",
            icon: Gauge,
            roles: ["ADMIN"],
          },
          {
            label: "Kalibrasyon",
            href: "/purchasing",
            icon: Barcode,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Depo",
        href: "/warehouse",
        icon: Box,
        roles: ["ADMIN", "ENGINEER"],
      },
      {
        label: "Kullanıcı Yönetimi",
        href: "/admin/users",
        icon: Users,
        roles: ["ADMIN"],
      },
    ],
  };

  if (pathsToMinimize.includes(pathname)) {
    return null;
  }

  const filteredSidebarItems: SidebarItems = {
    admin: sidebarItems.admin
      .filter((item) => hasSidebarAccess(user?.role as UserRole, item.roles))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((subItem) =>
          hasSidebarAccess(user?.role as UserRole, subItem.roles)
        ),
      }))
      .filter((item) => (item.subItems ? item.subItems.length > 0 : true)),
  };

  return (
    <>
      <SidebarDesktop
        items={filteredSidebarItems}
        className={className}
        userRole={user?.role as UserRole}
      />
      <SidebarMobile
        items={filteredSidebarItems}
        userRole={user?.role as UserRole}
      />
    </>
  );
}
