"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/authorization";
import { useSidebar } from "@/context/SidebarContext";
import {
  ClipboardList,
  Home,
  Layers,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tags,
  UserCircle,
  UserCog,
  Users,
} from "lucide-react";
import { HorizontaLDots } from "@/icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const homeNavItem: NavItem = {
  icon: <Home />,
  name: "Home",
  path: "/",
};

const navGroups: NavGroup[] = [
  {
    label: "Catalog",
    items: [
      {
        icon: <Search />,
        name: "SEO",
        path: "/seo",
        permission: "seo:read",
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        icon: <ShoppingBag />,
        name: "Customers",
        path: "/customers",
        permission: "customer:read",
      },
    ],
  },
  {
    label: "Access Control",
    items: [
      {
        icon: <Users />,
        name: "Users",
        path: "/users",
        permission: "user:read",
      },
      {
        icon: <UserCog />,
        name: "Roles",
        path: "/roles",
        permission: "role:read",
      },
      // {
      //   icon: <ShieldCheck />,
      //   name: "Permissions",
      //   path: "/permissions",
      //   permission: "permission:read",
      // },
    ],
  },
  {
    label: "Account",
    items: [
      {
        icon: <UserCircle />,
        name: "Profile",
        path: "/profile",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(`${path}/`),
    [pathname],
  );

  const handleNavClick = () => {
    if (isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-3"
        >
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Scantoz Logo"
            width={isExpanded || isHovered || isMobileOpen ? 80 : 60}
            height={40}
            className="shrink-0"
          />

          {/* Brand text */}
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Scantoz
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Admin
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 space-y-6">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href={homeNavItem.path}
                onClick={handleNavClick}
                className={`menu-item group ${
                  isActive(homeNavItem.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(homeNavItem.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {homeNavItem.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{homeNavItem.name}</span>
                )}
              </Link>
            </li>
          </ul>
          {navGroups.map((group) => {
            // Filter items by permission
            const visibleItems = group.items.filter(
              (item) =>
                !item.permission || hasPermission(role, item.permission),
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label}>
                {/* Group Header */}
                <h2
                  className={`mb-3 text-xs uppercase text-gray-400 ${
                    !isExpanded && !isHovered ? "lg:text-center" : "px-2"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    group.label
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>

                {/* Items */}
                <ul className="flex flex-col gap-2">
                  {visibleItems.map((nav) => (
                    <li key={nav.name}>
                      <Link
                        href={nav.path}
                        onClick={handleNavClick}
                        className={`menu-item group ${
                          isActive(nav.path)
                            ? "menu-item-active"
                            : "menu-item-inactive"
                        }`}
                      >
                        <span
                          className={`${
                            isActive(nav.path)
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }`}
                        >
                          {nav.icon}
                        </span>

                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{nav.name}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
