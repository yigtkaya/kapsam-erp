// types.ts
import { UserRole } from "@/types/core";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  subItems?: SidebarItem[];
  roles?: UserRole[];
}

export interface SidebarItems {
  admin: SidebarItem[];
  editor?: SidebarItem[];
  user?: SidebarItem[];
  extras?: ReactNode;
}

export interface SidebarProps {
  className?: string;
}
