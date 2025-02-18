"use client";

import { LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarItems } from "./types";
import { logout } from "@/api/auth";

interface SidebarDesktopProps {
  items: SidebarItems;
  className?: string;
}

export default function SidebarDesktop({
  items,
  className,
}: SidebarDesktopProps) {
  const pathname = usePathname();
  const itemsToDisplay = items.admin || [];
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleSubItems = (label: string, event: React.MouseEvent) => {
    event.preventDefault();
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isSubItemActive = (link: any) => {
    if (link.subItems) {
      return link.subItems.some((subItem: any) => pathname === subItem.href);
    }
    return pathname === link.href;
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r z-50 transition-all duration-300",
        isExpanded ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedItems([]);
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 flex justify-center items-center">
          {isExpanded ? (
            <div className="w-full flex justify-center">
              <Image
                src="/images/LOGO.jpg"
                alt="Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8">
              <Image
                src="/images/LOGO.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {itemsToDisplay.map((link: any, index: number) => (
              <div key={index}>
                {link.subItems ? (
                  // Parent item with subitems
                  <div>
                    <button
                      onClick={(e) => toggleSubItems(link.label, e)}
                      className={cn(
                        "flex items-center w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors",
                        isSubItemActive(link) && "bg-gray-100 text-gray-900",
                        isExpanded ? "px-4 py-2" : "px-2 py-2 justify-center"
                      )}
                    >
                      <link.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isExpanded ? "mr-3" : "mx-auto"
                        )}
                      />
                      {isExpanded && (
                        <>
                          <span className="text-sm flex-1 text-left">
                            {link.label}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedItems.includes(link.label) &&
                                "transform rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>
                    {/* SubItems */}
                    {isExpanded && expandedItems.includes(link.label) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.subItems.map((subItem: any, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={cn(
                              "flex items-center text-gray-500 hover:text-gray-900 hover:bg-gray-100/30 rounded-lg px-4 py-2 text-sm",
                              pathname === subItem.href &&
                                "bg-gray-100 text-gray-900"
                            )}
                          >
                            <subItem.icon className="h-4 w-4 mr-3" />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular item without subitems
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors",
                      pathname === link.href && "bg-gray-100 text-gray-900",
                      isExpanded ? "px-4 py-2" : "px-2 py-2 justify-center"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isExpanded ? "mr-3" : "mx-auto"
                      )}
                    />
                    {isExpanded && (
                      <span className="text-sm whitespace-nowrap">
                        {link.label}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200">
          <div className="p-4 space-y-3">
            <form
              action={async () => {
                await logout();
              }}
            >
              <button
                type="submit"
                className={cn(
                  "w-full flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors",
                  isExpanded ? "px-4 py-2" : "px-2 py-2 justify-center"
                )}
              >
                <LogOut
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isExpanded ? "mr-3" : "mx-auto"
                  )}
                />
                {isExpanded && <span className="text-sm">Çıkış Yap</span>}
              </button>
            </form>

            <div className="text-gray-400 text-xs text-center mt-2">v1.2.0</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
