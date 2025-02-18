"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { SidebarItems } from "./types";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { hasSidebarAccess } from "@/components/sidebar/sidebar-desktop";
import { UserRole } from "@/types/core";

interface SidebarMobileProps {
  items: SidebarItems;
  userRole?: UserRole;
}

export default function SidebarMobile({ items, userRole }: SidebarMobileProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const filteredItems = (items.admin || [])
    .filter((item) => hasSidebarAccess(userRole as UserRole, item.roles))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter((subItem) =>
        hasSidebarAccess(userRole as UserRole, subItem.roles)
      ),
    }))
    .filter((item) => (item.subItems ? item.subItems.length > 0 : true));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-center">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {filteredItems.map((item, index) => (
                <div key={index}>
                  {item.subItems ? (
                    <div className="mb-2">
                      <div
                        className={cn(
                          "flex items-center text-gray-600 px-4 py-2 text-sm font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center text-gray-500 hover:text-gray-900 hover:bg-gray-100/30 rounded-lg px-4 py-2 text-sm",
                              pathname === subItem.href &&
                                "bg-gray-100 text-gray-900"
                            )}
                          >
                            <subItem.icon className="h-4 w-4 mr-3" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg px-4 py-2 text-sm",
                        pathname === item.href && "bg-gray-100 text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
