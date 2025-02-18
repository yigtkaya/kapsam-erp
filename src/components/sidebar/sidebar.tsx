"use client";

import {
  Factory,
  Gauge,
  Hammer,
  Home,
  List,
  Package,
  Table,
  Wrench,
  Trash2,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  ClipboardList,
  Activity,
  Box,
  Cog,
  ScrollText,
  Database,
  Truck,
  CheckCircle,
  Archive,
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
        label: "Satış",
        href: "/sales",
        icon: ShoppingCart,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Siparişler",
            href: "/sales/orders",
            icon: ClipboardList,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Tasarım",
        href: "/design",
        icon: Hammer,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Müşteri Teknik Resimleri",
            href: "/design/customer-drawings",
            icon: FileSpreadsheet,
            roles: ["ADMIN"],
          },
          {
            label: "MKI",
            href: "/design/mki",
            icon: Database,
            roles: ["ADMIN"],
          },
          {
            label: "Konfigürasyon Yönetimi",
            href: "/design/configuration",
            icon: Cog,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Üretim Planlama",
        href: "/production-planning",
        icon: Activity,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Ürün Reçeteleri",
            href: "/production-planning/recipes",
            icon: ScrollText,
            roles: ["ADMIN"],
          },
          {
            label: "İş Emirleri",
            href: "/production-planning/work-orders",
            icon: ClipboardList,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Satınalma",
        href: "/purchasing",
        icon: Truck,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Tedarikçi Bilgi Formları & Sözleşmeler",
            href: "/purchasing/supplier-forms",
            icon: FileText,
            roles: ["ADMIN"],
          },
          {
            label: "Onaylı Tedarikçi Listesi",
            href: "/purchasing/approved-suppliers",
            icon: CheckCircle,
            roles: ["ADMIN"],
          },
          {
            label: "Satınalma Sipariş Formları",
            href: "/purchasing/order-forms",
            icon: ClipboardList,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Üretim",
        href: "/production",
        icon: Factory,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Üretim Raporu",
            href: "/production/reports",
            icon: FileText,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Bakım",
        href: "/maintenance",
        icon: Wrench,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Bakım Planları",
            href: "/maintenance/plans",
            icon: ClipboardList,
            roles: ["ADMIN"],
          },
          {
            label: "Makine Kimlik Kartları",
            href: "/maintenance/machine-cards",
            icon: FileText,
            roles: ["ADMIN"],
          },
          {
            label: "Arıza Bildirimleri",
            href: "/maintenance/fault-reports",
            icon: Activity,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Depo",
        href: "/warehouse",
        icon: Box,
        roles: ["ADMIN", "ENGINEER"],
        subItems: [
          {
            label: "Hammadde",
            href: "/warehouse/raw-materials",
            icon: Package,
            roles: ["ADMIN", "ENGINEER"],
          },
          {
            label: "Proses",
            href: "/warehouse/process",
            icon: Activity,
            roles: ["ADMIN", "ENGINEER"],
          },
          {
            label: "Mamül Depo",
            href: "/warehouse/shipping-assembly",
            icon: Truck,
            roles: ["ADMIN", "ENGINEER"],
          },
          {
            label: "Hurda",
            href: "/warehouse/scrap",
            icon: Trash2,
            roles: ["ADMIN", "ENGINEER"],
          },
          {
            label: "Karantina",
            href: "/warehouse/quarantine",
            icon: Archive,
            roles: ["ADMIN", "ENGINEER"],
          },
          {
            label: "Takımhane",
            href: "/production/tooling",
            icon: Wrench,
            roles: ["ADMIN", "ENGINEER"],
          },
        ],
      },
      {
        label: "Kalite Yönetim Sistemi",
        href: "/quality-management",
        icon: Gauge,
        roles: ["ADMIN"],

        subItems: [
          {
            label: "Destek Doküman",
            href: "/quality-management/support-docs",
            icon: FileText,
            roles: ["ADMIN"],
          },
          {
            label: "El Kitabı",
            href: "/quality-management/manual",
            icon: FileText,
            roles: ["ADMIN"],
          },
          {
            label: "Form",
            href: "/quality-management/forms",
            icon: ClipboardList,
            roles: ["ADMIN"],
          },
          {
            label: "Görev Tanımları",
            href: "/quality-management/job-descriptions",
            icon: ScrollText,
            roles: ["ADMIN"],
          },
          {
            label: "Liste",
            href: "/quality-management/lists",
            icon: List,
            roles: ["ADMIN"],
          },
          {
            label: "Plan",
            href: "/quality-management/plans",
            icon: Activity,
            roles: ["ADMIN"],
          },
          {
            label: "Prosedür",
            href: "/quality-management/procedures",
            icon: ScrollText,
            roles: ["ADMIN"],
          },
          {
            label: "Şema",
            href: "/quality-management/schemas",
            icon: Activity,
            roles: ["ADMIN"],
          },
          {
            label: "Tablo",
            href: "/quality-management/tables",
            icon: Table,
            roles: ["ADMIN"],
          },
          {
            label: "Talimat",
            href: "/quality-management/instructions",
            icon: FileText,
            roles: ["ADMIN"],
          },
        ],
      },
      {
        label: "Kalite Kontrol",
        href: "/quality-control",
        icon: CheckCircle,
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
