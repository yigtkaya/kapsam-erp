// types.ts
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  subItems?: SidebarItem[];
}

export interface SidebarItems {
  admin: SidebarItem[];
  editor?: SidebarItem[];
  user?: SidebarItem[];
  extras?: ReactNode;
}

export interface SidebarProps {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  className?: string;
}
