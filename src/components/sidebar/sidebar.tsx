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
import { SidebarItems, SidebarProps } from "./types";
import SidebarDesktop from "./sidebar-desktop";

export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname();
  const pathsToMinimize = ["/login", "/"];

  const sidebarItems: SidebarItems = {
    admin: [
      { label: "Anasayfa", href: "/", icon: Home },
      {
        label: "Satış",
        href: "/sales",
        icon: ShoppingCart,
        subItems: [
          {
            label: "Siparişler",
            href: "/sales/orders",
            icon: ClipboardList,
          },
        ],
      },
      {
        label: "Tasarım",
        href: "/design",
        icon: Hammer,
        subItems: [
          {
            label: "Müşteri Teknik Resimleri",
            href: "/design/customer-drawings",
            icon: FileSpreadsheet,
          },
          {
            label: "MKI",
            href: "/design/mki",
            icon: Database,
          },
          {
            label: "Konfigürasyon Yönetimi",
            href: "/design/configuration",
            icon: Cog,
          },
        ],
      },
      {
        label: "Üretim Planlama",
        href: "/production-planning",
        icon: Activity,
        subItems: [
          {
            label: "Ürün Reçeteleri",
            href: "/production-planning/recipes",
            icon: ScrollText,
          },
          {
            label: "İş Emirleri",
            href: "/production-planning/work-orders",
            icon: ClipboardList,
          },
        ],
      },
      {
        label: "Satınalma",
        href: "/purchasing",
        icon: Truck,
        subItems: [
          {
            label: "Tedarikçi Bilgi Formları & Sözleşmeler",
            href: "/purchasing/supplier-forms",
            icon: FileText,
          },
          {
            label: "Onaylı Tedarikçi Listesi",
            href: "/purchasing/approved-suppliers",
            icon: CheckCircle,
          },
          {
            label: "Satınalma Sipariş Formları",
            href: "/purchasing/order-forms",
            icon: ClipboardList,
          },
        ],
      },
      {
        label: "Üretim",
        href: "/production",
        icon: Factory,
        subItems: [
          {
            label: "Üretim Raporu",
            href: "/production/reports",
            icon: FileText,
          },
        ],
      },
      {
        label: "Bakım",
        href: "/maintenance",
        icon: Wrench,
        subItems: [
          {
            label: "Bakım Planları",
            href: "/maintenance/plans",
            icon: ClipboardList,
          },
          {
            label: "Makine Kimlik Kartları",
            href: "/maintenance/machine-cards",
            icon: FileText,
          },
          {
            label: "Arıza Bildirimleri",
            href: "/maintenance/fault-reports",
            icon: Activity,
          },
        ],
      },
      {
        label: "Depo",
        href: "/warehouse",
        icon: Box,
        subItems: [
          {
            label: "Hammadde",
            href: "/warehouse/raw-materials",
            icon: Package,
          },
          {
            label: "Proses",
            href: "/warehouse/process",
            icon: Activity,
          },
          {
            label: "Mamül Depo",
            href: "/warehouse/shipping-assembly",
            icon: Truck,
          },
          {
            label: "Hurda",
            href: "/warehouse/scrap",
            icon: Trash2,
          },
          {
            label: "Karantina",
            href: "/warehouse/quarantine",
            icon: Archive,
          },
          {
            label: "Takımhane",
            href: "/production/tooling",
            icon: Wrench,
          },
        ],
      },
      {
        label: "Kalite Yönetim Sistemi",
        href: "/quality-management",
        icon: Gauge,
        subItems: [
          {
            label: "Destek Doküman",
            href: "/quality-management/support-docs",
            icon: FileText,
          },
          {
            label: "El Kitabı",
            href: "/quality-management/manual",
            icon: FileText,
          },
          {
            label: "Form",
            href: "/quality-management/forms",
            icon: ClipboardList,
          },
          {
            label: "Görev Tanımları",
            href: "/quality-management/job-descriptions",
            icon: ScrollText,
          },
          {
            label: "Liste",
            href: "/quality-management/lists",
            icon: List,
          },
          {
            label: "Plan",
            href: "/quality-management/plans",
            icon: Activity,
          },
          {
            label: "Prosedür",
            href: "/quality-management/procedures",
            icon: ScrollText,
          },
          {
            label: "Şema",
            href: "/quality-management/schemas",
            icon: Activity,
          },
          {
            label: "Tablo",
            href: "/quality-management/tables",
            icon: Table,
          },
          {
            label: "Talimat",
            href: "/quality-management/instructions",
            icon: FileText,
          },
        ],
      },
      {
        label: "Kalite Kontrol",
        href: "/quality-control",
        icon: CheckCircle,
      },
    ],
  };

  if (pathsToMinimize.includes(pathname)) {
    return null;
  }

  return (
    <>
      <SidebarDesktop items={sidebarItems} className={className} />
      <SidebarMobile items={sidebarItems} />
    </>
  );
}
